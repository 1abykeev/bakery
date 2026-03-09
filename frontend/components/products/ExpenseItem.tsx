// frontend/src/components/products/ExpenseItem.tsx

"use client";

import { Expense } from "@/types";

interface Props {
  expense:  Expense;
  onDelete: (id: number) => void;
}

export default function ExpenseItem({ expense, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-stone-100 rounded-xl group hover:shadow-sm transition-all duration-150">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
          {expense.name[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-stone-700">{expense.name}</span>
      </div>
      <button
        onClick={() => onDelete(expense.id)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all duration-150"
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}