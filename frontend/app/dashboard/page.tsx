// frontend/src/app/dashboard/page.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Дашборд</h1>
        {user && (
          <p className="text-stone-500 mb-6">
            Добро пожаловать, {user.full_name}!
          </p>
        )}
        <p className="text-stone-400 text-sm mb-8">Здесь будет ваш дашборд</p>
        <button
          onClick={logout}
          className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium px-6 py-2 rounded-xl transition"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}