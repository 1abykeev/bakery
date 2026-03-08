// frontend/src/app/dashboard/analytics/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "@/lib/api";
import {
  AnalyticsData, TopProduct, ExpenseBreakdown, StaffSalary,
} from "@/types";

// ── helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("ru-KG", { maximumFractionDigits: 0 });
}

function fmtDateShort(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${d}.${m}`;
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  return d;
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday
  d.setDate(d.getDate() + diff);
  return d;
}

const PIE_COLORS = ["#F59E0B", "#EF4444", "#10B981"];
const EXPENSE_COLORS = [
  "#F59E0B", "#EF4444", "#3B82F6", "#10B981",
  "#8B5CF6", "#F97316", "#06B6D4", "#EC4899",
];

// ── tiny shared components ─────────────────────────────────────────────────

function Section({
  title, children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="font-semibold text-stone-800 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-stone-300">
      <svg
        width="32" height="32" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.5} className="mb-2"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function KpiCard({
  label, value, sub, iconColor, icon,
}: {
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider leading-tight">
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconColor + "1A" }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-800 leading-none">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-2">{sub}</p>}
    </div>
  );
}

// Custom recharts tooltips
function BarTip({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-100 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="text-stone-400 text-xs mb-1">{label && fmtDateShort(label)}</p>
      <p className="font-bold text-stone-800">{fmt(payload[0].value)} сом</p>
    </div>
  );
}

function PieTip({
  active, payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-100 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="text-stone-400 text-xs mb-1">{payload[0].name}</p>
      <p className="font-bold text-stone-800">{fmt(payload[0].value)} сом</p>
    </div>
  );
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 animate-pulse">
      <div className="h-3 bg-stone-100 rounded w-1/2 mb-4" />
      <div className="h-7 bg-stone-100 rounded w-2/3 mb-2" />
      <div className="h-2.5 bg-stone-100 rounded w-1/3" />
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

type Preset = "today" | "week" | "month" | "all";

export default function AnalyticsPage() {
  const today = new Date();

  const [dateFrom, setDateFrom]       = useState<Date>(startOfMonth());
  const [dateTo, setDateTo]           = useState<Date>(today);
  const [data, setData]               = useState<AnalyticsData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [activePreset, setActivePreset] = useState<Preset>("month");

  // ── fetch ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (from: Date, to: Date) => {
    setLoading(true);
    setData(null);
    try {
      const res = await api.get("/analytics/", {
        params: {
          date_from: toISO(from),
          date_to:   toISO(to),
        },
      });
      setData(res.data);
    } catch {
      // Axios interceptor handles 401
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(dateFrom, dateTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── presets ────────────────────────────────────────────────────────────
  const applyPreset = (preset: Preset) => {
    setActivePreset(preset);
    const to = new Date();
    let from = new Date();
    if (preset === "today") {
      from = new Date();
    } else if (preset === "week") {
      from = startOfWeek();
    } else if (preset === "month") {
      from = startOfMonth();
    } else {
      from = new Date("2020-01-01");
    }
    setDateFrom(from);
    setDateTo(to);
    fetchData(from, to);
  };

  // ── derived ────────────────────────────────────────────────────────────
  const pieData = data
    ? [
        { name: "Өндүрүш наркы", value: data.production_cost },
        { name: "Эмгек акы",     value: data.salary_cost },
        { name: "Таза пайда",    value: Math.max(data.net_profit, 0) },
      ].filter((d) => d.value > 0)
    : [];

  const pct = (part: number) =>
    data && data.revenue > 0
      ? `${Math.round((part / data.revenue) * 100)}% киреше`
      : undefined;

  const presetCls = (p: Preset) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      activePreset === p
        ? "bg-amber-500 text-white shadow-sm"
        : "text-stone-500 hover:text-stone-700 hover:bg-stone-200"
    }`;

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* ── Page header + date controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Аналитика</h1>
          <p className="text-stone-400 text-sm mt-1">
            Бизнесиңиздин негизги көрсөткүчтөрү
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset buttons */}
          <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
            {(["today", "week", "month", "all"] as Preset[]).map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={presetCls(p)}
              >
                {p === "today" ? "Бүгүн"
                  : p === "week" ? "Жума"
                  : p === "month" ? "Ай"
                  : "Баары"}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          <div className="flex items-center gap-1.5">
            <DatePicker
              selected={dateFrom}
              onChange={(d: Date | null) => {
                if (!d) return;
                setDateFrom(d);
                setActivePreset("month"); // clear highlight
                fetchData(d, dateTo);
              }}
              selectsStart
              startDate={dateFrom}
              endDate={dateTo}
              maxDate={dateTo}
              dateFormat="dd.MM.yy"
              className="w-28 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            />
            <span className="text-stone-300">—</span>
            <DatePicker
              selected={dateTo}
              onChange={(d: Date | null) => {
                if (!d) return;
                setDateTo(d);
                setActivePreset("month");
                fetchData(dateFrom, d);
              }}
              selectsEnd
              startDate={dateFrom}
              endDate={dateTo}
              minDate={dateFrom}
              maxDate={today}
              dateFormat="dd.MM.yy"
              className="w-28 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
          <div className="bg-white rounded-2xl border border-stone-100 p-6 h-72 animate-pulse">
            <div className="h-full bg-stone-50 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 h-64 animate-pulse">
              <div className="h-full bg-stone-50 rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 h-64 animate-pulse">
              <div className="h-full bg-stone-50 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      {!loading && data && (
        <>
          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Жалпы киреше"
              value={`${fmt(data.revenue)} сом`}
              sub={`${data.total_sales_count} сатуу`}
              iconColor="#F59E0B"
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#F59E0B" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <KpiCard
              label="Өндүрүш наркы"
              value={`${fmt(data.production_cost)} сом`}
              sub={pct(data.production_cost)}
              iconColor="#EF4444"
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#EF4444" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />
            <KpiCard
              label="Эмгек акы"
              value={`${fmt(data.salary_cost)} сом`}
              sub={pct(data.salary_cost)}
              iconColor="#3B82F6"
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#3B82F6" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <KpiCard
              label="Таза пайда"
              value={`${fmt(data.net_profit)} сом`}
              sub={pct(data.net_profit)}
              iconColor={data.net_profit >= 0 ? "#10B981" : "#EF4444"}
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke={data.net_profit >= 0 ? "#10B981" : "#EF4444"}
                  strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d={data.net_profit >= 0
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
              }
            />
          </div>

          {/* ── Extra count badges ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-stone-100 px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#F59E0B" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-stone-800">{data.total_sales_count}</p>
                <p className="text-xs text-stone-400 mt-0.5">Жалпы транзакция</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="#3B82F6" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-stone-800">{data.unique_clients}</p>
                <p className="text-xs text-stone-400 mt-0.5">Уникалдуу кардарлар</p>
              </div>
            </div>
          </div>

          {/* ── Daily revenue bar chart ── */}
          <Section title="Күнүмдүк киреше">
            {data.daily_revenue.length === 0 ? (
              <Empty text="Маалымат жок" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.daily_revenue}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  barSize={data.daily_revenue.length < 8 ? 36 : data.daily_revenue.length < 15 ? 20 : undefined}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDateShort}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                    interval={data.daily_revenue.length > 20 ? "preserveStartEnd" : 0}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}к` : String(v)
                    }
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    content={<BarTip />}
                    cursor={{ fill: "#F9FAFB", radius: 6 }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Section>

          {/* ── Two column: top products + pie ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top products */}
            <Section title="Эң көп сатылган продукттар">
              {data.top_products.length === 0 ? (
                <Empty text="Маалымат жок" />
              ) : (
                <div className="space-y-4">
                  {data.top_products.map((p: TopProduct, i: number) => {
                    const maxUnits = data.top_products[0].units_sold;
                    const barPct = Math.round((p.units_sold / maxUnits) * 100);
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-stone-300 w-5 flex-shrink-0">
                              #{i + 1}
                            </span>
                            <span className="text-sm font-medium text-stone-700 truncate">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            <span className="text-xs text-stone-400">
                              {p.units_sold} дана
                            </span>
                            <span className="text-sm font-bold text-stone-800">
                              {fmt(p.revenue)} сом
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* Profit distribution pie */}
            <Section title="Киреше бөлүштүрүлүшү">
              {pieData.length === 0 ? (
                <Empty text="Маалымат жок" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* ── Ingredient expense breakdown ── */}
          <Section title="Ингредиент чыгымдары">
            {data.expense_breakdown.length === 0 ? (
              <Empty text="Маалымат жок" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {data.expense_breakdown.map((e: ExpenseBreakdown, i: number) => {
                  const maxCost = data.expense_breakdown[0].total_cost;
                  const barPct  = Math.round((e.total_cost / maxCost) * 100);
                  const revPct  = data.revenue > 0
                    ? Math.round((e.total_cost / data.revenue) * 100)
                    : 0;
                  return (
                    <div key={e.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                EXPENSE_COLORS[i % EXPENSE_COLORS.length],
                            }}
                          />
                          <span className="text-sm font-medium text-stone-700">
                            {e.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-xs text-stone-400">
                            {revPct}%
                          </span>
                          <span className="text-sm font-bold text-stone-800">
                            {fmt(e.total_cost)} сом
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${barPct}%`,
                            backgroundColor:
                              EXPENSE_COLORS[i % EXPENSE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* ── Staff salary table ── */}
          <Section title="Кызматкерлердин эмгек акысы">
            {data.staff_salary.length === 0 ? (
              <Empty text="Бул мезгилде иш журналы жок" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {["Кызматкер", "Саатына", "Иш убактысы", "Эмгек акы"].map(
                        (h, i) => (
                          <th
                            key={h}
                            className={`text-xs font-semibold text-stone-400 uppercase tracking-wider pb-4 ${
                              i === 0 ? "text-left" : "text-right"
                            }`}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {data.staff_salary.map((s: StaffSalary) => (
                      <tr key={s.name}>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-700 font-bold text-xs">
                                {s.name
                                  .split(" ")
                                  .map((w) => w[0] ?? "")
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-stone-800">
                                {s.name}
                              </p>
                              <p className="text-xs text-stone-400">
                                {s.profession}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-stone-500">
                          {fmt(s.salary_hour)} сом
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-sm font-medium text-stone-800">
                            {s.hours % 1 === 0
                              ? s.hours
                              : s.hours.toFixed(1)}{" "}
                            саат
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-sm font-bold text-stone-800">
                            {fmt(s.salary)} сом
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-stone-200">
                      <td
                        className="pt-4 text-sm font-bold text-stone-700"
                        colSpan={2}
                      >
                        Жалпы
                      </td>
                      <td className="pt-4 text-right text-sm font-bold text-stone-800">
                        {(() => {
                          const t = data.staff_salary.reduce(
                            (acc, r) => acc + r.hours,
                            0
                          );
                          return `${t % 1 === 0 ? t : t.toFixed(1)} саат`;
                        })()}
                      </td>
                      <td className="pt-4 text-right text-sm font-bold text-stone-800">
                        {fmt(data.salary_cost)} сом
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Section>

          {/* ── Empty state when all zeroes ── */}
          {data.revenue === 0 &&
            data.production_cost === 0 &&
            data.salary_cost === 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-10 text-center">
                <p className="text-amber-700 font-semibold">
                  Бул мезгил үчүн маалымат жок
                </p>
                <p className="text-amber-600 text-sm mt-1">
                  Башка дата аралыгын тандаңыз же сатуу жазыңыз
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
}