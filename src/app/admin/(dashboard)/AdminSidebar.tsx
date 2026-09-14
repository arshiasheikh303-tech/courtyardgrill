"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, CalendarCheck, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-parchment/10 bg-char-900 lg:flex">
      <div className="border-b border-parchment/10 px-6 py-6">
        <p className="font-display text-lg text-cream">
          COURTYARD <span className="text-ember-400">GRILL</span>
        </p>
        <p className="mt-1 text-xs text-parchment/50">Admin · {adminName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition",
                active ? "bg-ember-500 text-char-950" : "text-parchment/70 hover:bg-char-800 hover:text-cream"
              )}
            >
              <Icon size={17} /> {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-parchment/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-parchment/70 hover:bg-char-800 hover:text-cream"
        >
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </aside>
  );
}
