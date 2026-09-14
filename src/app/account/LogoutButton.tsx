"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-sm border border-parchment/30 px-5 py-2.5 text-sm text-cream hover:border-cream"
    >
      Log Out
    </button>
  );
}
