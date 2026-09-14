"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPKR } from "@/lib/utils";

export function CartDrawer() {
  const { lines, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-char-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-char-800 border-l border-parchment/10 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-parchment/10 px-6 py-5">
              <h2 className="font-display text-xl text-cream">Your Order</h2>
              <button
                aria-label="Close cart"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-parchment hover:bg-char-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-parchment/70">
                  <ShoppingBag size={36} />
                  <p>Your cart is empty.</p>
                  <Link
                    href="/menu"
                    onClick={() => setIsOpen(false)}
                    className="text-ember-400 underline underline-offset-4"
                  >
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {lines.map((line) => (
                    <li key={line.menuItemId} className="flex gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-cream">{line.name}</p>
                        <p className="text-sm text-parchment/60">{formatPKR(line.price)}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(line.menuItemId, line.quantity - 1)}
                            className="rounded-full border border-parchment/20 p-1 text-parchment hover:border-ember-500 hover:text-ember-400"
                            aria-label={`Decrease ${line.name} quantity`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center text-sm">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.menuItemId, line.quantity + 1)}
                            className="rounded-full border border-parchment/20 p-1 text-parchment hover:border-ember-500 hover:text-ember-400"
                            aria-label={`Increase ${line.name} quantity`}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(line.menuItemId)}
                            className="ml-auto text-xs text-parchment/50 underline underline-offset-4 hover:text-ember-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gold-400">
                        {formatPKR(line.price * line.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-parchment/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-cream">
                  <span className="font-body">Subtotal</span>
                  <span className="font-display text-lg text-gold-400">{formatPKR(subtotal)}</span>
                </div>
                <Link
                  href="/order"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-sm bg-ember-500 py-3 text-center font-medium tracking-wide text-char-950 transition hover:bg-ember-400"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
