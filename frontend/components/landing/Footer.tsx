// frontend/src/components/landing/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-400 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-white font-bold text-lg mb-1">Sweetflow</p>
          <p className="text-sm">Простое управление бизнесом</p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link href="#features" className="hover:text-white transition">Функции</Link>
          <Link href="#pricing" className="hover:text-white transition">Цены</Link>
          <Link href="/login" className="hover:text-white transition">Войти</Link>
          <Link href="/register" className="hover:text-white transition">Регистрация</Link>
        </div>

        <p className="text-sm">© {new Date().getFullYear()} Sweetflow</p>
      </div>
    </footer>
  );
}