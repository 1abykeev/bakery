// frontend/src/components/staff/StaffAddModal.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { Staff } from "@/types";
import { useEffect } from "react";

const staffSchema = z.object({
  name:        z.string().min(1, "Аты-жөнүн киргизиңиз"),
  phone:       z.string().min(1, "Телефон номерин киргизиңиз"),
  profession:  z.string().min(1, "Кесибин киргизиңиз"),
  salary_hour: z.string().min(1, "Саатына акысын киргизиңиз"),
});

type StaffFormInput = z.infer<typeof staffSchema>;

interface Props {
  onClose: () => void;
  onAdded: (staff: Staff) => void;
}

export default function StaffAddModal({ onClose, onAdded }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(staffSchema),
  });

  // Close on ESC key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function onSubmit(data: StaffFormInput) {
    try {
      const res = await api.post<Staff>("/staff/", data);
      onAdded(res.data);
    } catch (err) {
      console.error(err);
      alert("Кызматкер кошуу мүмкүн болгон жок.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Кызматкер кошуу</h2>
            <p className="text-stone-400 text-sm mt-0.5">Жаңы кызматкердин маалыматтарын киргизиңиз</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Аты-жөнү
            </label>
            <input
              {...register("name")}
              placeholder="Айбек Матисаков"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Телефон номери
            </label>
            <input
              {...register("phone")}
              placeholder="+996 700 000 000"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Кесиби
            </label>
            <input
              {...register("profession")}
              placeholder="Нанчы, Кассир, Курьер..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
            />
            {errors.profession && (
              <p className="text-red-500 text-xs mt-1">{errors.profession.message}</p>
            )}
          </div>

          {/* Salary per hour */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Саатына эмгек акы (сом)
            </label>
            <div className="relative">
              <input
                {...register("salary_hour")}
                type="number"
                placeholder="150"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 pr-14 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
                сом
              </span>
            </div>
            {errors.salary_hour && (
              <p className="text-red-500 text-xs mt-1">{errors.salary_hour.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition"
            >
              Жокко чыгаруу
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm transition shadow-sm shadow-amber-200"
            >
              {isSubmitting ? "Кошулуп жатат..." : "Кошуу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}