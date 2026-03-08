// frontend/src/components/products/ProductExpenseRow.tsx

"use client";

import { Product, Expense } from "@/types";

interface Props {
  product:    Product;
  expenses:   Expense[];
  onAddExpense: (product: Product) => void;
  onRemoveExpense: (productId: number, peId: number) => void;
}

export default function ProductExpenseRow({ product, onAddExpense, onRemoveExpense }: Props) {
  return (
    <div className="bg-white border border-stone-100 rounded-xl p-4 hover:shadow-sm transition-all duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Product name */}
          <div className="flex-shrink-0">
            <p className="text-sm font-semibold text-stone-800">{product.name}</p>
            <p className="text-xs text-amber-600 font-medium">{product.price} сом</p>
          </div>

          {/* Expense badges */}
          <div className="flex flex-wrap gap-1.5 ml-4">
            {product.expenses.length === 0 && (
              <span className="text-xs text-stone-400 italic">Чыгым жок</span>
            )}
            {product.expenses.map((pe) => (
              <span
                key={pe.id}
                className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full group/badge"
              >
                {pe.expense_name} — {pe.cost} сом
                <button
                  onClick={() => onRemoveExpense(product.id, pe.id)}
                  className="opacity-0 group-hover/badge:opacity-100 text-red-400 hover:text-red-600 transition-opacity ml-0.5"
                >
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add expense button */}
        <button
          onClick={() => onAddExpense(product)}
          className="flex-shrink-0 ml-4 flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Чыгым кошуу
        </button>
      </div>
    </div>
  );
}