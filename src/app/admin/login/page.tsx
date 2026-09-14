"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-char-950 px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-sm text-ember-400">Courtyard Grill</p>
        <h1 className="mt-2 text-center font-display text-3xl text-cream">Admin Login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-parchment/70">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-3 text-cream focus:border-ember-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-parchment/70">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-3 text-cream focus:border-ember-500"
            />
          </div>

          {status === "error" && <p className="text-sm text-ember-400">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-sm bg-ember-500 py-3.5 font-medium text-char-950 transition hover:bg-ember-400 disabled:opacity-60"
          >
            {status === "loading" ? "Logging in…" : "Log In"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-parchment/40">
          Restricted area — Courtyard Grill staff only.
        </p>
      </div>
    </div>
  );
}
