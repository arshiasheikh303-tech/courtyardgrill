"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPKR, cn } from "@/lib/utils";
import type { MenuCategoryDTO } from "@/types";

const DELIVERY_FEE = 150;

export default function OrderPage() {
  const router = useRouter();
  const { lines, addItem, updateQuantity, removeItem, subtotal, clear } = useCart();
  const [categories, setCategories] = useState<MenuCategoryDTO[]>([]);
  const [activeCat, setActiveCat] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [type, setType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [payment, setPayment] = useState<"CASH_ON_DELIVERY" | "PAY_ON_PICKUP">("CASH_ON_DELIVERY");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.[0]) setActiveCat(data.categories[0].slug);
      })
      .finally(() => setLoadingMenu(false));
  }, []);

  useEffect(() => {
    if (type === "PICKUP") setPayment("PAY_ON_PICKUP");
    else setPayment("CASH_ON_DELIVERY");
  }, [type]);

  const deliveryFee = type === "DELIVERY" && lines.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      setError("Your cart is empty — add something tasty first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          type,
          address: form.address,
          paymentMethod: payment,
          notes: form.notes,
          items: lines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setOrderNumber(data.order.orderNumber);
      clear();
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-char-900 px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto text-ember-400" size={42} />
          <h1 className="mt-5 font-display text-3xl text-cream">Order Placed!</h1>
          <p className="mt-3 text-parchment/65">
            Order <span className="text-gold-400">{orderNumber}</span> is confirmed. We&apos;re
            firing up the grill — thanks for ordering from Courtyard Grill.
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="mt-8 rounded-sm border border-parchment/30 px-6 py-3 text-sm text-cream hover:border-cream"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-char-900">
      <div className="container-px mx-auto max-w-7xl py-16">
        <p className="text-sm text-ember-400">Order online</p>
        <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">Build Your Order</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Menu picker */}
          <div>
            {categories.length > 0 && (
              <div className="sticky top-20 z-20 -mx-6 flex gap-6 overflow-x-auto border-y border-parchment/10 bg-char-900/95 px-6 py-3 backdrop-blur md:mx-0 md:rounded-sm md:border">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#ord-${cat.slug}`}
                    onClick={() => setActiveCat(cat.slug)}
                    className={cn(
                      "shrink-0 border-b-2 py-1 text-sm transition",
                      activeCat === cat.slug ? "border-ember-500 text-cream" : "border-transparent text-parchment/50"
                    )}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}

            {loadingMenu && <p className="py-16 text-center text-parchment/50">Loading menu…</p>}

            {categories.map((cat) => (
              <div key={cat.id} id={`ord-${cat.slug}`} className="scroll-mt-36 border-b border-parchment/10 py-8 first:pt-8">
                <h2 className="font-display text-2xl text-gold-400">{cat.name}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {cat.items.map((item) => {
                    const line = lines.find((l) => l.menuItemId === item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-sm border border-parchment/10 bg-char-800 p-4">
                        <div>
                          <p className="font-medium text-cream">{item.name}</p>
                          <p className="text-sm text-gold-400">{formatPKR(item.price)}</p>
                        </div>
                        {line ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, line.quantity - 1)}
                              className="rounded-full border border-parchment/20 p-1.5 text-parchment hover:border-ember-500"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-5 text-center text-sm">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, line.quantity + 1)}
                              className="rounded-full border border-parchment/20 p-1.5 text-parchment hover:border-ember-500"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              addItem({
                                menuItemId: item.id,
                                name: item.name,
                                price: item.price,
                                imageUrl: item.imageUrl,
                              })
                            }
                            className="rounded-sm border border-ember-500 px-3 py-2 text-xs font-medium text-ember-400 hover:bg-ember-500 hover:text-char-950"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cart + checkout */}
          <div className="h-fit lg:sticky lg:top-28">
            <div className="rounded-sm border border-parchment/10 bg-char-800 p-6">
              <h2 className="font-display text-xl text-cream">Your Cart</h2>

              {lines.length === 0 ? (
                <p className="mt-4 text-sm text-parchment/50">No items yet — add dishes from the menu.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {lines.map((l) => (
                    <li key={l.menuItemId} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-parchment/80">
                        {l.quantity} × {l.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gold-400">{formatPKR(l.price * l.quantity)}</span>
                        <button onClick={() => removeItem(l.menuItemId)} className="text-parchment/40 hover:text-ember-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 space-y-1 border-t border-parchment/10 pt-4 text-sm">
                <div className="flex justify-between text-parchment/70">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-parchment/70">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee ? formatPKR(deliveryFee) : "—"}</span>
                </div>
                <div className="flex justify-between pt-2 font-display text-lg text-cream">
                  <span>Total</span>
                  <span className="text-gold-400">{formatPKR(total)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 rounded-sm border border-parchment/10 bg-char-800 p-6">
              <h2 className="font-display text-xl text-cream">Checkout</h2>

              <div className="mt-4 flex gap-2">
                {(["DELIVERY", "PICKUP"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 rounded-sm border py-2.5 text-sm capitalize transition",
                      type === t ? "border-ember-500 bg-ember-500 text-char-950" : "border-parchment/20 text-parchment/70"
                    )}
                  >
                    {t === "DELIVERY" ? "Delivery" : "Pickup"}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-2.5 text-sm text-cream focus:border-ember-500"
                />
                <input
                  required
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-2.5 text-sm text-cream focus:border-ember-500"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-2.5 text-sm text-cream focus:border-ember-500"
                />
                {type === "DELIVERY" && (
                  <textarea
                    required
                    rows={2}
                    placeholder="Delivery Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-2.5 text-sm text-cream focus:border-ember-500"
                  />
                )}
                <textarea
                  rows={2}
                  placeholder="Order notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-900 px-4 py-2.5 text-sm text-cream focus:border-ember-500"
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm text-parchment/70">Payment</p>
                <div className="space-y-2 text-sm text-parchment/80">
                  {type === "DELIVERY" ? (
                    <label className="flex items-center gap-2">
                      <input type="radio" checked readOnly /> Cash on Delivery
                    </label>
                  ) : (
                    <label className="flex items-center gap-2">
                      <input type="radio" checked readOnly /> Pay on Pickup
                    </label>
                  )}
                </div>
                <p className="mt-1 text-xs text-parchment/40">
                  Online card payment (JazzCash / EasyPaisa / Stripe) coming soon.
                </p>
              </div>

              {status === "error" && <p className="mt-4 text-sm text-ember-400">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-5 w-full rounded-sm bg-ember-500 py-3.5 font-medium text-char-950 transition hover:bg-ember-400 disabled:opacity-60"
              >
                {status === "loading" ? "Placing Order…" : `Place Order — ${formatPKR(total)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
