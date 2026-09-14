"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import type { CartLine } from "@/types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cyg-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addItem(item: Omit<CartLine, "quantity">, qty = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((l) =>
          l.menuItemId === item.menuItemId ? { ...l, quantity: l.quantity + qty } : l
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  }

  function removeItem(menuItemId: string) {
    setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.menuItemId === menuItemId ? { ...l, quantity } : l))
    );
  }

  function clear() {
    setLines([]);
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider
      value={{ lines, addItem, removeItem, updateQuantity, clear, subtotal, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
