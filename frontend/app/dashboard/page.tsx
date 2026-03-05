// frontend/src/app/dashboard/page.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">
          Кош келиңиз{user ? `, ${user.first_name}` : ""}! 👋
        </h1>
        <p className="text-stone-500 mt-1 text-sm">
          НанБар башкаруу панелине кош келдиңиз
        </p>
      </div>

      {/* Quick stats placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Кызматкерлер", value: "—", icon: "👥", color: "bg-blue-50 border-blue-100" },
          { label: "Продукттар", value: "—", icon: "📦", color: "bg-amber-50 border-amber-100" },
          { label: "Бүгүнкү сатуу", value: "—", icon: "💰", color: "bg-green-50 border-green-100" },
          { label: "Склад", value: "—", icon: "🏪", color: "bg-purple-50 border-purple-100" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`border rounded-2xl p-5 ${stat.color}`}
          >
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            <p className="text-stone-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}