import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  PENDING: "text-parchment/60",
  CONFIRMED: "text-gold-400",
  PREPARING: "text-gold-400",
  READY: "text-moss",
  OUT_FOR_DELIVERY: "text-moss",
  COMPLETED: "text-moss",
  CANCELLED: "text-ember-400",
  APPROVED: "text-moss",
  REJECTED: "text-ember-400",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, orders, reservations] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.sub } }),
    prisma.order.findMany({
      where: { userId: session.sub },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.reservation.findMany({
      where: { userId: session.sub },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <div className="bg-char-900">
      <div className="container-px mx-auto max-w-5xl py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ember-400">My Account</p>
            <h1 className="mt-2 font-display text-4xl text-cream">{user.name}</h1>
            <p className="mt-1 text-sm text-parchment/60">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-gold-400">Order History</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-parchment/50">No orders yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((order: (typeof orders)[number]) => (
                <div key={order.id} className="rounded-sm border border-parchment/10 bg-char-800 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-cream">{order.orderNumber}</p>
                    <span className={`text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-parchment/50">
                    {order.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.type === "DELIVERY" ? "Delivery" : "Pickup"}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-parchment/70">
                    {order.items.map((it: (typeof order.items)[number]) => (
                      <li key={it.id}>
                        {it.quantity} × {it.nameAtTime}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-right font-display text-lg text-gold-400">
                    {formatPKR(order.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-gold-400">Reservations</h2>
          {reservations.length === 0 ? (
            <p className="mt-3 text-sm text-parchment/50">No reservations yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {reservations.map((r: (typeof reservations)[number]) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-parchment/10 bg-char-800 p-5"
                >
                  <div>
                    <p className="font-medium text-cream">
                      {r.date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} at {r.time}
                    </p>
                    <p className="text-sm text-parchment/60">{r.guests} guests</p>
                  </div>
                  <span className={`text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
