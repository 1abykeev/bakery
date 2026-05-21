// frontend/src/components/products/ProductCard.tsx

"use client";

import { Product } from "@/types";

interface Props {
  product:  Product;
  onDelete: (id: number) => void;
}


export default function ProductCard({ product, onDelete }: Props) {
  const totalCost = product.expenses.reduce((sum, pe) => sum + parseFloat(pe.cost), 0);
  const profit = parseFloat(product.price) - totalCost;

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 hover:shadow-md hover:shadow-stone-100 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-2xl">
            {product.emoji || "🧁"}
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-sm">{product.name}</p>
            <p className="text-amber-600 font-bold text-base mt-0.5">{product.price} сом</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(product.id)}
          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all duration-150"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Expenses */}
      {product.expenses.length > 0 ? (
        <div className="pt-3 border-t border-stone-50 space-y-2">
          {product.expenses.map((pe) => (
            <div key={pe.id} className="flex items-center justify-between">
              <span className="text-xs text-stone-500">{pe.expense_name}</span>
              <span className="text-xs font-medium text-stone-700">{pe.cost} сом</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-stone-100">
            <span className="text-xs text-stone-400">Чыгым</span>
            <span className="text-xs font-semibold text-red-500">-{totalCost.toFixed(2)} сом</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Пайда</span>
            <span className={`text-xs font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
              {profit.toFixed(2)} сом
            </span>
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-stone-50">
          <p className="text-xs text-stone-400">Чыгым кошулган жок</p>
        </div>
      )}
    </div>
  );
}