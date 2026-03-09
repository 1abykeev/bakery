// frontend/src/components/sales/SellModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "@/lib/api";
import { Product, Sale } from "@/types";

const schema = z.object({
  quantity:     z.number().min(1, "Кеминде 1 болушу керек"),
  client_name:  z.string().optional(),
  client_phone: z.string().optional(),
});
type FormInput = z.infer<typeof schema>;

interface Props {
  product:  Product;
  onClose:  () => void;
  onSold:   (sale: Sale, updatedStock: number) => void;
}

export default function SellModal({ product, onClose, onSold }: Props) {
  const [soldAt, setSoldAt] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity") || 1;
  const totalPreview = (parseFloat(product.price) * quantity).toFixed(2);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  async function onSubmit(data: FormInput) {
    setSubmitting(true);
    try {
      // Format date as YYYY-MM-DD
      const sold_at = soldAt.toISOString().split("T")[0];
      const res = await api.post<Sale>("/sales/", {
        product_id:   product.id,
        quantity:     data.quantity,
        client_name:  data.client_name || "",
        client_phone: data.client_phone || "",
        sold_at,
      });
      // Pass back sale + new stock (original stock minus quantity sold)
      onSold(res.data, product.stock - data.quantity);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      alert(error.response?.data?.detail || "Сатуу мүмкүн болгон жок.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalExpenseCost = product.expenses.reduce(
    (sum, pe) => sum + parseFloat(pe.cost), 0
  );
  const profitPerUnit    = parseFloat(product.price) - totalExpenseCost;
  const totalProfit      = profitPerUnit * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Сатуу</h2>
            <p className="text-amber-600 font-semibold text-sm mt-0.5">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product summary */}
        <div className="bg-amber-50 rounded-xl p-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-200 text-amber-700 font-bold text-xs flex items-center justify-center">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-stone-500">Баасы</p>
              <p className="text-sm font-bold text-stone-800">{product.price} сом</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">Складта</p>
            <p className={`text-sm font-bold ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
              {product.stock} дана
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Канча данасы сатылды?
            </label>
            <div className="flex items-center gap-3">
              <input
                {...register("quantity", { valueAsNumber: true })}
                type="number"
                min={1}
                max={product.stock}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm font-semibold text-center transition"
              />
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
            )}
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Сатылган күнү
            </label>
            <DatePicker
              selected={soldAt}
              onChange={(date: Date | null) => { if (date) setSoldAt(date); }}
              dateFormat="dd.MM.yyyy"
              maxDate={new Date()}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
              wrapperClassName="w-full"
            />
          </div>

          {/* Client name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Кардардын аты <span className="text-stone-400 font-normal">(милдеттүү эмес)</span>
            </label>
            <input
              {...register("client_name")}
              placeholder="Айбек"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
            />
          </div>

          {/* Client phone */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Телефон номери <span className="text-stone-400 font-normal">(милдеттүү эмес)</span>
            </label>
            <input
              {...register("client_phone")}
              placeholder="+996 700 000 000"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
            />
          </div>

          {/* Live price preview */}
          <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 border border-stone-100">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Жалпы сумма</span>
              <span className="font-bold text-stone-800">{totalPreview} сом</span>
            </div>
            {product.expenses.length > 0 && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Чыгым (данасына)</span>
                  <span className="text-red-400">-{(totalExpenseCost * quantity).toFixed(2)} сом</span>
                </div>
                <div className="flex justify-between text-xs border-t border-stone-200 pt-1.5">
                  <span className="text-stone-500 font-medium">Болжолдуу пайда</span>
                  <span className={`font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {totalProfit.toFixed(2)} сом
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition"
            >
              Жокко чыгаруу
            </button>
            <button
              type="submit"
              disabled={submitting || product.stock === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm transition shadow-sm shadow-amber-200"
            >
              {submitting ? "Сатылып жатат..." : "Сатуу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}