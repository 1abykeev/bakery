// frontend/src/components/products/ProductAddModal.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { Product } from "@/types";

const schema = z.object({
  name:  z.string().min(1, "Продукттун атын киргизиңиз"),
  price: z.string().min(1, "Баасын киргизиңиз"),
});
type FormInput = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onAdded: (p: Product) => void;
}

export default function ProductAddModal({ onClose, onAdded }: Props) {
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
      const res = await api.post<Product>("/products/", data);
      onAdded(res.data);
    } catch {
      alert("Продукт кошуу мүмкүн болгон жок.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Продукт кошуу</h2>
            <p className="text-stone-400 text-sm mt-0.5">Жаңы продуктту кошуңуз</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Продукттун аты</label>
            <input {...register("name")} placeholder="Пончик, Торт, Нан..." className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Сатуу баасы</label>
            <div className="relative">
              <input {...register("price")} type="number" min="0" step="0.01" placeholder="100" className="w-full px-4 py-2.5 pr-14 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">сом</span>
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
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