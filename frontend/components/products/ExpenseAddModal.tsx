// frontend/src/components/products/ExpenseAddModal.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { Expense } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Чыгымдын атын киргизиңиз"),
});
type FormInput = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onAdded: (e: Expense) => void;
}

export default function ExpenseAddModal({ onClose, onAdded }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  async function onSubmit(data: FormInput) {
    try {
      const res = await api.post<Expense>("/products/expenses/", data);
      onAdded(res.data);
    } catch {
      alert("Чыгым кошуу мүмкүн болгон жок.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Чыгым кошуу</h2>
            <p className="text-stone-400 text-sm mt-0.5">Мис: Кант, Ун, Май...</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Чыгымдын аты</label>
            <input {...register("name")} placeholder="Кант" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition">Жокко чыгаруу</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm transition shadow-sm shadow-amber-200">
              {isSubmitting ? "Кошулуп жатат..." : "Кошуу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}