"use client";

import { Flame, Leaf, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPKR } from "@/lib/utils";
import type { MenuItemDTO } from "@/types";

export function MenuRow({ item }: { item: MenuItemDTO }) {
  const { addItem } = useCart();

  return (
    <div className="flex items-start gap-4 py-5">
      <div className="flex-1">
        <div className="menu-row">
          <h4 className="font-display text-base text-cream sm:text-lg">{item.name}</h4>
          <span className="leader" aria-hidden />
          <span className="font-display text-base text-gold-400 sm:text-lg">
            {formatPKR(item.price)}
          </span>
        </div>
        <p className="mt-1 max-w-xl text-sm text-parchment/55">{item.description}</p>
        <div className="mt-2 flex items-center gap-3">
          {item.isSpicy && (
            <span className="flex items-center gap-1 text-xs text-ember-400">
              <Flame size={12} /> Spicy
            </span>
          )}
          {item.isVeg && (
            <span className="flex items-center gap-1 text-xs text-moss">
              <Leaf size={12} /> Veg
            </span>
          )}
          {item.isPopular && (
            <span className="text-xs uppercase tracking-wide text-gold-500">Popular</span>
          )}
        </div>
      </div>
      <button
        onClick={() =>
          addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          })
        }
        className="mt-1 flex shrink-0 items-center gap-1 rounded-full border border-parchment/20 px-3 py-1.5 text-xs text-parchment/80 transition hover:border-ember-500 hover:text-ember-400"
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus size={13} /> Add
      </button>
    </div>
  );
}
