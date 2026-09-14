"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { MenuRow } from "@/components/menu/MenuRow";
import { cn } from "@/lib/utils";
import type { MenuCategoryDTO } from "@/types";

type Filter = "all" | "popular" | "spicy" | "veg";

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeCat, setActiveCat] = useState<string>("");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.[0]) setActiveCat(data.categories[0].slug);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return categories
      .map((cat) => {
        const items = cat.items.filter((item) => {
          if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
          if (filter === "popular" && !item.isPopular) return false;
          if (filter === "spicy" && !item.isSpicy) return false;
          if (filter === "veg" && !item.isVeg) return false;
          return true;
        });
        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, query, filter]);

  function scrollToCategory(slug: string) {
    setActiveCat(slug);
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return (
    <div className="bg-char-900">
      <div className="container-px mx-auto max-w-5xl pb-24 pt-16">
        <p className="text-sm text-ember-400">Our menu</p>
        <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">Full Menu</h1>
        <p className="mt-3 max-w-prose2 text-parchment/65">
          Every dish is grilled fresh to order over charcoal. Prices in Pakistani Rupees.
        </p>

        {/* Search + filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment/40" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              className="w-full rounded-sm border border-parchment/20 bg-char-800 py-3 pl-10 pr-4 text-cream placeholder:text-parchment/40 focus:border-ember-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(["all", "popular", "spicy", "veg"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs capitalize transition",
                  filter === f
                    ? "border-ember-500 bg-ember-500 text-char-950"
                    : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky category nav */}
        {categories.length > 0 && (
          <div className="sticky top-20 z-20 mt-8 -mx-6 border-y border-parchment/10 bg-char-900/95 px-6 py-3 backdrop-blur md:mx-0 md:rounded-sm md:border">
            <div className="flex gap-6 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={cn(
                    "shrink-0 border-b-2 py-1 text-sm transition",
                    activeCat === cat.slug
                      ? "border-ember-500 text-cream"
                      : "border-transparent text-parchment/50 hover:text-parchment/80"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mt-6">
          {loading && <p className="py-16 text-center text-parchment/50">Loading menu…</p>}

          {!loading && filtered.length === 0 && (
            <p className="py-16 text-center text-parchment/50">
              No dishes match your search. Try another term.
            </p>
          )}

          {filtered.map((cat) => (
            <div key={cat.id} id={`cat-${cat.slug}`} className="scroll-mt-36 border-b border-parchment/10 py-8 first:pt-0">
              <h2 className="font-display text-2xl text-gold-400">{cat.name}</h2>
              <div className="divide-y divide-parchment/10">
                {cat.items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
