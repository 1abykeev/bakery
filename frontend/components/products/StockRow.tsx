// frontend/src/components/products/StockRow.tsx

"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Product } from "@/types";

interface Props {
  product:    Product;
  onUpdated:  (p: Product) => void;
}

export default function StockRow({ product, onUpdated }: Props) {
  const [editing, setEditing]   = useState(false);
  const [value, setValue]       = useState(String(product.stock));
  const [saving, setSaving]     = useState(false);

  async function handleSave() {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      alert("Туура сан киргизиңиз.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch<Product>(`/products/${product.id}/update_stock/`, { stock: num });
      onUpdated(res.data);
      setEditing(false);
    } catch {
      alert("Складты жаңыртуу мүмкүн болгон жок.");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setEditing(false); setValue(String(product.stock)); }
  }

  const stockColor =
    product.stock === 0 ? "text-red-500 bg-red-50"
    : product.stock < 10 ? "text-amber-600 bg-amber-50"
    : "text-green-600 bg-green-50";

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border border-stone-100 rounded-xl hover:shadow-sm transition-all duration-150">
      {/* Left: product info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
          {product.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800">{product.name}</p>
          <p className="text-xs text-stone-400">{product.price} сом / данасы</p>
        </div>
      </div>

      {/* Right: stock */}
      <div className="flex items-center gap-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-24 px-3 py-1.5 text-sm rounded-lg border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-semibold"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition disabled:opacity-60"
            >
              {saving ? "..." : "Сактоо"}
            </button>
            <button
              onClick={() => { setEditing(false); setValue(String(product.stock)); }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium rounded-lg transition"
            >
              Жокко
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${stockColor}`}>
              {product.stock} дана
            </span>
            <button
              onClick={() => { setEditing(true); setValue(String(product.stock)); }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium rounded-lg transition"
            >
              Өзгөртүү
            </button>
          </div>
        )}
      </div>
    </div>
  );
}