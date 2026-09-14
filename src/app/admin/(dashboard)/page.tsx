import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/utils";
import { ClipboardList, DollarSign, Clock3, CalendarCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, totalCustomers, reservationsToday, todayOrderTotals, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.reservation.count({ where: { date: { gte: startOfDay } } }),
      prisma.order.findMany({ where: { createdAt: { gte: startOfDay } }, select: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

  const todayRevenue = todayOrderTotals.reduce(
    (s: number, o: (typeof todayOrderTotals)[number]) => s + o.total,
    0
  );

  return { todayOrders, todayRevenue, pendingOrders, totalCustomers, reservationsToday, recentOrders };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Today's Orders", value: stats.todayOrders, icon: ClipboardList },
    { label: "Today's Revenue", value: formatPKR(stats.todayRevenue), icon: DollarSign },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock3 },
    { label: "Reservations Today", value: stats.reservationsToday, icon: CalendarCheck },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Dashboard</h1>
      <p className="mt-1 text-sm text-parchment/60">Here&apos;s what&apos;s happening today.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c: (typeof cards)[number]) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-sm border border-parchment/10 bg-char-900 p-5">
              <Icon className="text-ember-400" size={20} />
              <p className="mt-3 font-display text-2xl text-cream">{c.value}</p>
              <p className="mt-1 text-xs text-parchment/50">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-gold-400">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border border-parchment/10">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-char-900 text-left text-parchment/50">
              <tr>
                <th className="px-4 py-3 font-normal">Order #</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Type</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment/10">
              {stats.recentOrders.map((o: (typeof stats.recentOrders)[number]) => (
                <tr key={o.id} className="bg-char-900/40">
                  <td className="px-4 py-3 text-cream">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-parchment/70">{o.customerName}</td>
                  <td className="px-4 py-3 text-parchment/70">{o.type}</td>
                  <td className="px-4 py-3 text-parchment/70">{o.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-right text-gold-400">{formatPKR(o.total)}</td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-parchment/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
