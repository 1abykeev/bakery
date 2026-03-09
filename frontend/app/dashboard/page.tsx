// frontend/src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

interface DashboardStats {
  staffCount:   number;
  productCount: number;
  todayRevenue: number;
  totalStock:   number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [staffRes, productsRes, analyticsRes] = await Promise.all([
          api.get("/staff/"),
          api.get("/products/"),
          api.get("/analytics/", {
            params: { date_from: today, date_to: today },
          }),
        ]);

        const products = productsRes.data as { stock: number }[];

        setStats({
          staffCount:   staffRes.data.length,
          productCount: products.length,
          todayRevenue: analyticsRes.data.revenue,
          totalStock:   products.reduce((sum, p) => sum + p.stock, 0),
        });
      } catch {
        // silent — Axios interceptor handles 401
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label:    "Кызматкерлер",
      value:    stats?.staffCount ?? 0,
      suffix:   "адам",
      iconBg:   "bg-blue-50",
      iconColor:"text-blue-500",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label:    "Продукттар",
      value:    stats?.productCount ?? 0,
      suffix:   "түр",
      iconBg:   "bg-amber-50",
      iconColor:"text-amber-500",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label:    "Бүгүнкү сатуу",
      value:    stats?.todayRevenue ?? 0,
      suffix:   "сом",
      money:    true,
      iconBg:   "bg-green-50",
      iconColor:"text-green-500",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label:    "Жалпы склад",
      value:    stats?.totalStock ?? 0,
      suffix:   "дана",
      iconBg:   "bg-purple-50",
      iconColor:"text-purple-500",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">
          Кош келиңиз{user ? `, ${user.first_name}` : ""}! 👋
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          НанБар башкаруу панелине кош келдиңиз
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm"
          >
            {/* Icon */}
            <div className={`w-10 h-10 ${card.iconBg} ${card.iconColor} rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>

            {/* Value — skeleton while loading */}
            {loading ? (
              <div className="h-8 w-24 bg-stone-100 rounded-lg animate-pulse mb-2" />
            ) : (
              <p className="text-2xl font-bold text-stone-800 leading-none mb-1.5">
                {"money" in card && card.money
                  ? card.value.toLocaleString("ru-KG", { maximumFractionDigits: 0 })
                  : card.value}
              </p>
            )}

            {/* Label + suffix */}
            <div className="flex items-baseline gap-1.5">
              <p className="text-stone-500 text-sm">{card.label}</p>
              {!loading && (
                <span className="text-stone-300 text-xs">{card.suffix}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}