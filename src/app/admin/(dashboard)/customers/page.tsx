import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true, reservations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Customers</h1>
      <p className="mt-1 text-sm text-parchment/60">{customers.length} registered customers.</p>

      <div className="mt-6 overflow-x-auto rounded-sm border border-parchment/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-char-900 text-left text-parchment/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">Orders</th>
              <th className="px-4 py-3 font-normal">Reservations</th>
              <th className="px-4 py-3 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment/10">
            {customers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-parchment/40">No customers yet.</td></tr>
            )}
            {customers.map((c: (typeof customers)[number]) => (
              <tr key={c.id} className="bg-char-900/40">
                <td className="px-4 py-3 text-cream">{c.name}</td>
                <td className="px-4 py-3 text-parchment/70">{c.email}</td>
                <td className="px-4 py-3 text-parchment/70">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-parchment/70">{c._count.orders}</td>
                <td className="px-4 py-3 text-parchment/70">{c._count.reservations}</td>
                <td className="px-4 py-3 text-parchment/70">
                  {c.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
