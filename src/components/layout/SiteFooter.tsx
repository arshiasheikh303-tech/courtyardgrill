"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Clock, Facebook } from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-parchment/10 bg-char-950">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-cream">
            COURTYARD <span className="text-ember-400">GRILL</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-parchment/60">
            Authentic charcoal BBQ and Pakistani favourites, served hot in the heart of DHA, Lahore.
          </p>
          <a
            href="https://www.facebook.com/p/Courtyard-Grill-100063652133623/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-parchment/60 hover:text-ember-400"
          >
            <Facebook size={16} /> Facebook
          </a>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-gold-400">Explore</p>
          <ul className="space-y-2 text-sm text-parchment/70">
            <li><Link href="/menu" className="hover:text-cream">Menu</Link></li>
            <li><Link href="/reservations" className="hover:text-cream">Reservations</Link></li>
            <li><Link href="/order" className="hover:text-cream">Order Online</Link></li>
            <li><Link href="/gallery" className="hover:text-cream">Gallery</Link></li>
            <li><Link href="/about" className="hover:text-cream">About Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-gold-400">Visit</p>
          <div className="flex gap-2 text-sm text-parchment/70">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span>DHA T-Block, Lower Ground, 37-T, Phase 2 Commercial, DHA, behind Subway, Lahore</span>
          </div>
          <div className="mt-3 flex gap-2 text-sm text-parchment/70">
            <Clock size={16} className="mt-0.5 shrink-0" />
            <span>Open daily · 1:00 PM – 1:00 AM</span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-gold-400">Contact</p>
          <a
            href="tel:+923015174888"
            className="flex items-center gap-2 text-sm text-parchment/70 hover:text-cream"
          >
            <Phone size={16} /> +92 301 5174888
          </a>
          <Link
            href="/reservations"
            className="mt-4 inline-block rounded-sm border border-ember-500 px-4 py-2 text-sm text-ember-400 hover:bg-ember-500 hover:text-char-950"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
      <div className="border-t border-parchment/10 py-6 text-center text-xs text-parchment/40">
        © {new Date().getFullYear()} Courtyard Grill, DHA Phase 2, Lahore. All rights reserved.
      </div>
    </footer>
  );
}
