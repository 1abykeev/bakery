// frontend/src/app/dashboard/clients/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { Client } from "@/types";
import api from "@/lib/api";

// ── helpers ────────────────────────────────────────────────────────────────

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

// Days since last visit
function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function lastVisitLabel(dateStr: string): string {
  const d = daysSince(dateStr);
  if (d === 0) return "Бүгүн";
  if (d === 1) return "Кечээ";
  if (d < 7)  return `${d} күн мурун`;
  if (d < 30) return `${Math.floor(d / 7)} жума мурун`;
  return fmtDate(dateStr);
}

// Color avatar based on first letter
const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];
function avatarColor(name: string): string {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ── ClientRow ──────────────────────────────────────────────────────────────

function ClientRow({ client }: { client: Client }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors">

          {/* Avatar */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${avatarColor(client.name || client.phone)}`}>
            {initials(client.name || client.phone)}
          </div>

          {/* Name + phone */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-800 text-sm truncate">
              {client.name || (
                <span className="text-stone-400 italic">Аты жок</span>
              )}
            </p>
            <p className="text-stone-400 text-xs mt-0.5">
              {client.phone || "—"}
            </p>
          </div>

          {/* Product badges — hidden on small screens */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap max-w-[220px]">
            {client.products.slice(0, 3).map((p) => (
              <span key={p} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
            {client.products.length > 3 && (
              <span className="text-xs text-stone-400">
                +{client.products.length - 3}
              </span>
            )}
          </div>

          {/* Last visit */}
          <div className="hidden sm:flex flex-col items-end mr-1 flex-shrink-0">
            <span className="text-xs font-medium text-stone-600">
              {lastVisitLabel(client.last_visit)}
            </span>
            <span className="text-xs text-stone-400 mt-0.5">акыркы бару</span>
          </div>

          {/* Visit count */}
          <div className="flex flex-col items-center w-12 flex-shrink-0">
            <span className="text-lg font-bold text-stone-800">{client.visit_count}</span>
            <span className="text-xs text-stone-400">бару</span>
          </div>

          {/* Total spent */}
          <div className="flex flex-col items-end w-24 flex-shrink-0">
            <span className="text-sm font-bold text-stone-800">
              {client.total_spent.toLocaleString()} <span className="text-xs font-normal text-stone-400">сом</span>
            </span>
            <span className="text-xs text-stone-400">жалпы</span>
          </div>

          {/* Chevron */}
          <svg
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
            className={`text-stone-300 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Purchase history */}
      {expanded && (
        <div className="border-t border-stone-100">
          <div className="px-5 py-3 bg-stone-50 flex items-center gap-2">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-stone-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Сатып алуу тарыхы
            </span>
          </div>

          <div className="divide-y divide-stone-50">
            {client.purchases.map((purchase) => (
              <div
                key={purchase.sale_id}
                className="flex items-center gap-4 px-5 py-3"
              >
                {/* Date */}
                <span className="text-xs font-medium text-stone-500 w-24 flex-shrink-0">
                  {fmtDate(purchase.date)}
                </span>

                {/* Product */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-sm text-stone-700 truncate">
                    {purchase.product_name}
                  </span>
                  <span className="text-xs text-stone-400 flex-shrink-0">
                    × {purchase.quantity}
                  </span>
                </div>

                {/* Amount */}
                <span className="text-sm font-semibold text-stone-800 flex-shrink-0">
                  {parseFloat(purchase.total_price).toLocaleString()} сом
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    api.get("/sales/clients/")
      .then((res) => setClients(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Client-side search: name or phone
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [clients, search]);

  // Summary stats
  const totalSpent = clients.reduce((s, c) => s + c.total_spent, 0);
  const totalVisits = clients.reduce((s, c) => s + c.visit_count, 0);

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Кардарлар</h1>
        <p className="text-stone-400 text-sm mt-1">
          Сатуулардан автоматтык түзүлгөн кардарлар базасы
        </p>
      </div>

      {/* Stats */}
      {!loading && clients.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-400 mb-1">Жалпы кардарлар</p>
            <p className="text-2xl font-bold text-stone-800">{clients.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-400 mb-1">Жалпы баруулар</p>
            <p className="text-2xl font-bold text-amber-600">{totalVisits}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-stone-400 mb-1">Жалпы сатуу</p>
            <p className="text-2xl font-bold text-stone-800">
              {totalSpent.toLocaleString()}{" "}
              <span className="text-sm font-normal text-stone-400">сом</span>
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      {!loading && clients.length > 0 && (
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Аты же телефон боюнча издөө..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Search result count */}
      {search && (
        <p className="text-xs text-stone-400 mb-3">
          {filtered.length} кардар табылды
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-stone-400">
          <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Жүктөлүүдө...
        </div>
      )}

      {/* Empty — no clients at all */}
      {!loading && clients.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-stone-500 font-medium">Кардарлар жок</p>
          <p className="text-stone-400 text-sm mt-1">
            Сатуу жазганда кардардын атын же телефонун киргизиңиз
          </p>
        </div>
      )}

      {/* Empty search result */}
      {!loading && clients.length > 0 && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
          <p className="text-stone-500 font-medium">Табылган жок</p>
          <p className="text-stone-400 text-sm mt-1">
            &quot;{search}&quot; боюнча кардар жок
          </p>
        </div>
      )}

      {/* Client list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((client) => (
            <ClientRow
              key={client.phone || client.name}
              client={client}
            />
          ))}
        </div>
      )}
    </div>
  );
}