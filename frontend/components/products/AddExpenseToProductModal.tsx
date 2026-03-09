// frontend/src/components/products/AddExpenseToProductModal.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { Expense, Product } from "@/types";

const schema = z.object({
  expense_id: z.string().min(1, "Чыгымды тандаңыз"),
  cost:        z.string().min(1, "Суммасын киргизиңиз"),
});
type FormInput = z.infer<typeof schema>;

interface Props {
  product:    Product;
  expenses:   Expense[];
  onClose:    () => void;
  onUpdated:  (p: Product) => void;
}

export default function AddExpenseToProductModal({ product, expenses, onClose, onUpdated }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Filter out expenses already linked to this product
  const linkedIds = product.expenses.map((pe) => pe.expense_id);
  const available = expenses.filter((e) => !linkedIds.includes(e.id));

  async function onSubmit(data: FormInput) {
    try {
      const res = await api.post<Product>(`/products/${product.id}/add_expense/`, {
        expense_id: Number(data.expense_id),
        cost: data.cost,
      });
      onUpdated(res.data);
      onClose();
    } catch {
      alert("Чыгым кошуу мүмкүн болгон жок.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Чыгым кошуу</h2>
            <p className="text-stone-400 text-sm mt-0.5">
              <span className="text-amber-600 font-medium">{product.name}</span> продуктуна
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Already linked expenses */}
        {product.expenses.length > 0 && (
          <div className="mb-5 mt-3 p-3 bg-stone-50 rounded-xl">
            <p className="text-xs text-stone-400 font-medium mb-2">Учурда кошулган чыгымдар:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.expenses.map((pe) => (
                <span key={pe.id} className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {pe.expense_name}
                  <span className="text-amber-500">— {pe.cost} сом</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {available.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-stone-500 text-sm">Бардык чыгымдар кошулган.</p>
            <p className="text-stone-400 text-xs mt-1">Чыгымдар өтмөгүнөн жаңы чыгым кошуңуз.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Чыгымды тандаңыз</label>
              <select {...register("expense_id")} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition">
                <option value="">— Тандаңыз —</option>
                {available.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              {errors.expense_id && <p className="text-red-500 text-xs mt-1">{errors.expense_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Бул продукт үчүн баасы</label>
              <div className="relative">
                <input {...register("cost")} type="number" min="0" step="0.01" placeholder="15" className="w-full px-4 py-2.5 pr-14 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">сом</span>
              </div>
              {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition">Жокко чыгаруу</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm transition shadow-sm shadow-amber-200">
                {isSubmitting ? "Кошулуп жатат..." : "Кошуу"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}