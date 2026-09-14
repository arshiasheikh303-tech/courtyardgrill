"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  guests: number;
  specialRequest: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-parchment/10 text-parchment/70",
  APPROVED: "bg-moss/20 text-moss",
  REJECTED: "bg-ember-500/20 text-ember-400",
  CANCELLED: "bg-ember-500/20 text-ember-400",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reservations");
    const data = await res.json();
    setReservations(data.reservations || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as Reservation["status"] } : r)));
    await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const visible = filter === "ALL" ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Reservations</h1>
      <p className="mt-1 text-sm text-parchment/60">Approve or reject incoming table bookings.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs transition",
              filter === s ? "border-ember-500 bg-ember-500 text-char-950" : "border-parchment/20 text-parchment/60"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-parchment/10">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-char-900 text-left text-parchment/50">
            <tr>
              <th className="px-4 py-3 font-normal">Guest</th>
              <th className="px-4 py-3 font-normal">Date & Time</th>
              <th className="px-4 py-3 font-normal">Guests</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment/10">
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-parchment/40">Loading…</td></tr>}
            {!loading && visible.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-parchment/40">No reservations.</td></tr>
            )}
            {visible.map((r) => (
              <tr key={r.id} className="bg-char-900/40 align-top">
                <td className="px-4 py-3">
                  <p className="text-cream">{r.name}</p>
                  <p className="text-xs text-parchment/50">{r.phone}</p>
                  {r.specialRequest && <p className="mt-1 text-xs text-parchment/40">“{r.specialRequest}”</p>}
                </td>
                <td className="px-4 py-3 text-parchment/70">
                  {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {r.time}
                </td>
                <td className="px-4 py-3 text-parchment/70">{r.guests}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-3 py-1 text-xs", statusStyle[r.status])}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="rounded-sm border border-parchment/20 bg-char-800 px-3 py-1.5 text-sm text-cream"
                  >
                    {["PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
