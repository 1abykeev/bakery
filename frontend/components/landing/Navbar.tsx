// frontend/src/components/landing/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Главная", href: "#home" },
  { label: "Функции", href: "#features" },
  { label: "Цены", href: "#pricing" },
  { label: "Отзывы", href: "#testimonials" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-amber-50/80 backdrop-blur-md border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-amber-700 tracking-tight">
          Sweetflow
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-stone-600 hover:text-amber-700 transition font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-stone-600 hover:text-amber-700 px-4 py-2 rounded-xl transition"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl transition"
          >
            Регистрация
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-stone-600"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-stone-600 transition ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-stone-600 transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-stone-600 transition ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-amber-50 border-t border-amber-100 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-stone-700 font-medium py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-amber-100">
            <Link href="/login" className="text-center text-stone-600 font-medium py-2 rounded-xl border border-stone-200">
              Войти
            </Link>
            <Link href="/register" className="text-center bg-amber-500 text-white font-semibold py-2 rounded-xl">
              Регистрация
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}