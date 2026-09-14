import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, totalCustomers, reservationsToday, allTodayOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.reservation.count({ where: { date: { gte: startOfDay } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfDay } },
        select: { total: true },
      }),
    ]);

  const todayRevenue = allTodayOrders.reduce(
    (sum: number, o: (typeof allTodayOrders)[number]) => sum + o.total,
    0
  );

  return NextResponse.json({
    todayOrders,
    todayRevenue,
    pendingOrders,
    totalCustomers,
    reservationsToday,
  });
}
