"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Sign up failed.");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-char-900 px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center text-sm text-ember-400">Join us</p>
        <h1 className="mt-2 text-center font-display text-3xl text-cream">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-parchment/70">Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-3 text-cream focus:border-ember-500"
            />
          </div>
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
            <label className="mb-1 block text-sm text-parchment/70">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-3 text-cream focus:border-ember-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-parchment/70">Password</label>
            <input
              required
              type="password"
              minLength={6}
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
            {status === "loading" ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment/60">
          Already have an account?{" "}
          <Link href="/login" className="text-ember-400 underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
