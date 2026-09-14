"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setIsOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-colors duration-300",
        scrolled ? "bg-char-950/95 backdrop-blur border-b border-parchment/10" : "bg-transparent"
      )}
    >
      <div className="container-px mx-auto flex h-20 max-w-7xl items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-wide text-cream">
          COURTYARD <span className="text-ember-400">GRILL</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-parchment/80 transition hover:text-cream",
                pathname === l.href && "text-cream"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className="hidden rounded-sm border border-ember-500 px-5 py-2 text-sm font-medium text-ember-400 transition hover:bg-ember-500 hover:text-char-950 sm:block"
          >
            Order Now
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
            className="relative rounded-full p-2 text-cream hover:bg-char-700"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ember-500 text-[11px] font-semibold text-char-950">
                {count}
              </span>
            )}
          </button>
          <button
            className="rounded-full p-2 text-cream lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-parchment/10 bg-char-950 lg:hidden">
          <nav className="container-px mx-auto flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded px-2 py-3 text-parchment/90 hover:bg-char-800 hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/order"
              className="mt-2 rounded-sm bg-ember-500 px-2 py-3 text-center font-medium text-char-950"
            >
              Order Now
            </Link>
            <div className="mt-3 flex gap-4 border-t border-parchment/10 pt-3 text-sm text-parchment/70">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
