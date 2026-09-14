"use client";

import { useEffect, useState } from "react";
import { formatPKR, cn } from "@/lib/utils";

type OrderItem = { id: string; nameAtTime: string; priceAtTime: number; quantity: number };
type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  type: "DELIVERY" | "PICKUP";
  address: string | null;
  paymentMethod: string;
  status: string;
  notes: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  user: { name: string; email: string } | null;
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

const statusStyle: Record<string, string> = {
  PENDING: "bg-parchment/10 text-parchment/70",
  CONFIRMED: "bg-gold-500/20 text-gold-400",
  PREPARING: "bg-gold-500/20 text-gold-400",
  READY: "bg-moss/20 text-moss",
  OUT_FOR_DELIVERY: "bg-moss/20 text-moss",
  COMPLETED: "bg-moss/30 text-moss",
  CANCELLED: "bg-ember-500/20 text-ember-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Orders</h1>
      <p className="mt-1 text-sm text-parchment/60">Track and manage incoming orders.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs transition",
              filter === s ? "border-ember-500 bg-ember-500 text-char-950" : "border-parchment/20 text-parchment/60"
            )}
          >
            {s.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-center text-parchment/40">Loading…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-center text-parchment/40">No orders in this view.</p>
        )}
        {visible.map((order) => (
          <div key={order.id} className="rounded-sm border border-parchment/10 bg-char-900">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <div>
                <p className="font-medium text-cream">{order.orderNumber}</p>
                <p className="text-xs text-parchment/50">
                  {order.customerName} · {order.customerPhone} · {order.type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-gold-400">{formatPKR(order.total)}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs", statusStyle[order.status])}>
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>
            </button>

            {expanded === order.id && (
              <div className="border-t border-parchment/10 px-5 py-4">
                <ul className="space-y-1 text-sm text-parchment/70">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>{it.quantity} × {it.nameAtTime}</span>
                      <span>{formatPKR(it.priceAtTime * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 text-sm text-parchment/60">
                  {order.address && <p>Address: {order.address}</p>}
                  {order.notes && <p>Notes: {order.notes}</p>}
                  <p>Payment: {order.paymentMethod.replaceAll("_", " ")}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-parchment/60">Update status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-sm border border-parchment/20 bg-char-800 px-3 py-1.5 text-sm text-cream"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
