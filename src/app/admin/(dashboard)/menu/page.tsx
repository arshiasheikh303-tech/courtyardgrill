"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { formatPKR, cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };
type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  category: Category;
  isSpicy: boolean;
  isVeg: boolean;
  isPopular: boolean;
  isAvailable: boolean;
};

const emptyForm = {
  id: "",
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  isSpicy: false,
  isVeg: false,
  isPopular: false,
  isAvailable: true,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/menu");
    const data = await res.json();
    setItems(data.items || []);
    setCategories(data.categories || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
      imageUrl: item.imageUrl || "",
      categoryId: item.categoryId,
      isSpicy: item.isSpicy,
      isVeg: item.isVeg,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        categoryId: form.categoryId,
        isSpicy: form.isSpicy,
        isVeg: form.isVeg,
        isPopular: form.isPopular,
        isAvailable: form.isAvailable,
      };
      const res = await fetch(form.id ? `/api/admin/menu/${form.id}` : "/api/admin/menu", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item.");
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleAvailable(item: Item) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream">Menu Management</h1>
          <p className="mt-1 text-sm text-parchment/60">Add, edit, or remove dishes from the live menu.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-sm bg-ember-500 px-5 py-2.5 text-sm font-medium text-char-950 hover:bg-ember-400"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-sm border border-parchment/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-char-900 text-left text-parchment/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Available</th>
              <th className="px-4 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment/10">
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-parchment/40">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-parchment/40">No menu items yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="bg-char-900/40">
                <td className="px-4 py-3 text-cream">{item.name}</td>
                <td className="px-4 py-3 text-parchment/70">{item.category?.name}</td>
                <td className="px-4 py-3 text-gold-400">{formatPKR(item.price)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      item.isAvailable ? "bg-moss/20 text-moss" : "bg-ember-500/20 text-ember-400"
                    )}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEdit(item)} className="text-parchment/60 hover:text-cream">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-parchment/60 hover:text-ember-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-char-950/80 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-parchment/10 bg-char-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-cream">{form.id ? "Edit Item" : "Add Item"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-parchment/50 hover:text-cream">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-2.5 text-cream focus:border-ember-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Description</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-2.5 text-cream focus:border-ember-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-parchment/70">Price (PKR)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-2.5 text-cream focus:border-ember-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-parchment/70">Category</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-2.5 text-cream focus:border-ember-500"
                  >
                    <option value="" disabled>Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-parchment/70">Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://…"
                  className="w-full rounded-sm border border-parchment/20 bg-char-800 px-4 py-2.5 text-cream focus:border-ember-500"
                />
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-parchment/70">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isSpicy} onChange={(e) => setForm({ ...form, isSpicy: e.target.checked })} />
                  Spicy
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} />
                  Popular
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
                  Available
                </label>
              </div>

              {error && <p className="text-sm text-ember-400">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-sm bg-ember-500 py-3 font-medium text-char-950 hover:bg-ember-400 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
