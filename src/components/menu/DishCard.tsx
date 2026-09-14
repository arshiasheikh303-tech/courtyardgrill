"use client";

import Image from "next/image";
import { Flame, Leaf, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPKR } from "@/lib/utils";
import type { MenuItemDTO } from "@/types";

export function DishCard({ item }: { item: MenuItemDTO }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-sm border border-parchment/10 bg-char-800 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-52 w-full overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-char-700 text-parchment/40">
            No image
          </div>
        )}
        {item.isPopular && (
          <span className="absolute left-3 top-3 rounded-full bg-ember-500 px-3 py-1 text-xs font-medium text-char-950">
            Popular
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-cream">{item.name}</h3>
          <div className="flex shrink-0 gap-1 pt-1">
            {item.isSpicy && <Flame size={14} className="text-ember-400" aria-label="Spicy" />}
            {item.isVeg && <Leaf size={14} className="text-moss" aria-label="Vegetarian" />}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-parchment/60">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg text-gold-400">{formatPKR(item.price)}</span>
          <button
            onClick={() =>
              addItem({
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
              })
            }
            className="flex items-center gap-1 rounded-sm border border-ember-500 px-3 py-2 text-xs font-medium text-ember-400 transition hover:bg-ember-500 hover:text-char-950"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
