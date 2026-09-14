import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const DELIVERY_FEE = 150;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Re-price every line item server-side — never trust client-sent prices.
  const menuItemIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  if (menuItems.length !== new Set(menuItemIds).size) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available." },
      { status: 400 }
    );
  }

  const unavailable = menuItems.find((m: (typeof menuItems)[number]) => !m.isAvailable);
  if (unavailable) {
    return NextResponse.json(
      { error: `"${unavailable.name}" is currently unavailable.` },
      { status: 400 }
    );
  }

  let subtotal = 0;
  const orderItemsData = data.items.map((line) => {
    const item = menuItems.find((m: (typeof menuItems)[number]) => m.id === line.menuItemId)!;
    subtotal += item.price * line.quantity;
    return {
      menuItemId: item.id,
      nameAtTime: item.name,
      priceAtTime: item.price,
      quantity: line.quantity,
    };
  });

  const deliveryFee = data.type === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const session = await getSession();

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.sub,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      type: data.type,
      address: data.type === "DELIVERY" ? data.address : null,
      paymentMethod: data.paymentMethod,
      notes: data.notes || null,
      subtotal,
      deliveryFee,
      total,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  if (data.customerEmail) {
    await sendOrderConfirmation(data.customerEmail, {
      name: data.customerName,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  }

  return NextResponse.json({ order }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ orders: [] });

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
