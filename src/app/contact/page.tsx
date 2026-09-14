"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="bg-char-900">
      <section className="container-px mx-auto max-w-7xl py-20">
        <p className="text-sm text-ember-400">Get in touch</p>
        <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">Contact Us</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0 text-ember-400" size={22} />
                <div>
                  <p className="font-medium text-cream">Address</p>
                  <p className="text-sm text-parchment/65">
                    DHA T-Block, Lower Ground, 37-T, Phase 2 Commercial, DHA, behind Subway, Sector T
                    DHA Phase 2, Lahore, 54500, Pakistan
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-1 shrink-0 text-ember-400" size={22} />
                <div>
                  <p className="font-medium text-cream">Phone</p>
                  <a href="tel:+923015174888" className="text-sm text-parchment/65 hover:text-cream">
                    +92 301 5174888
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-1 shrink-0 text-ember-400" size={22} />
                <div>
                  <p className="font-medium text-cream">Hours</p>
                  <p className="text-sm text-parchment/65">Open daily · 1:00 PM – 1:00 AM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923015174888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-sm bg-moss px-5 py-3 text-sm font-medium text-cream hover:opacity-90"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href="tel:+923015174888"
                className="flex items-center gap-2 rounded-sm border border-ember-500 px-5 py-3 text-sm font-medium text-ember-400 hover:bg-ember-500 hover:text-char-950"
              >
                <Phone size={16} /> Call Now
              </a>
            </div>

            <div className="mt-8 h-72 w-full overflow-hidden rounded-sm border border-parchment/10">
              <iframe
                title="Courtyard Grill location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Courtyard+Grill+DHA+Phase+2+Lahore&output=embed"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-sm border border-parchment/10 bg-char-800 p-8">
            <h2 className="font-display text-2xl text-cream">Send a Message</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-parchment/70">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-parchment/70">Phone (optional)</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Subject (optional)</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-3 text-cream focus:border-ember-500"
                />
              </div>

              {status === "error" && <p className="text-sm text-ember-400">{error}</p>}
              {status === "done" && (
                <p className="text-sm text-moss">Thanks — we&apos;ve received your message and will reply soon.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-sm bg-ember-500 py-3.5 font-medium text-char-950 transition hover:bg-ember-400 disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
