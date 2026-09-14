import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  });
  const categories = await prisma.menuCategory.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ items, categories });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const item = await prisma.menuItem.create({
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
      isAvailable: parsed.data.isAvailable ?? true,
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}
