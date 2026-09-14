"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function ReservationsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "19:00",
    guests: 2,
    specialRequest: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-char-900 px-6">
        <div className="max-w-md text-center">
          <CalendarCheck className="mx-auto text-ember-400" size={40} />
          <h1 className="mt-5 font-display text-3xl text-cream">Reservation Received</h1>
          <p className="mt-3 text-parchment/65">
            Thanks, {form.name.split(" ")[0]}. We&apos;ve noted your table for {form.guests}{" "}
            on {form.date} at {form.time}. We&apos;ll confirm shortly by phone.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setForm({ name: "", phone: "", email: "", date: "", time: "19:00", guests: 2, specialRequest: "" });
            }}
            className="mt-8 rounded-sm border border-parchment/30 px-6 py-3 text-sm text-cream hover:border-cream"
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-char-900">
      <section className="container-px mx-auto max-w-3xl py-20">
        <p className="text-sm text-ember-400">Book a table</p>
        <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">Reservations</h1>
        <p className="mt-3 text-parchment/65">
          Tables fill up fast on weekends — reserve ahead to guarantee your spot.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 rounded-sm border border-parchment/10 bg-char-800 p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-parchment/70">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-parchment/70">Phone</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-parchment/70">Email (optional, for confirmation)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-parchment/70">Date</label>
              <input
                required
                type="date"
                min={todayISO()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-parchment/70">Time</label>
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-parchment/70">Number of Guests</label>
              <input
                required
                type="number"
                min={1}
                max={30}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-parchment/70">Special Request (optional)</label>
              <textarea
                rows={3}
                value={form.specialRequest}
                onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
                className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                placeholder="Birthday setup, seating preference, allergies…"
              />
            </div>
          </div>

          {status === "error" && <p className="mt-4 text-sm text-ember-400">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-7 w-full rounded-sm bg-ember-500 py-3.5 font-medium text-char-950 transition hover:bg-ember-400 disabled:opacity-60"
          >
            {status === "loading" ? "Booking…" : "Reserve Table"}
          </button>
          <p className="mt-3 text-center text-xs text-parchment/40">
            For parties of 30+, please call us directly at +92 301 5174888.
          </p>
        </form>
      </section>
    </div>
  );
}
