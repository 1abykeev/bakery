// frontend/src/app/dashboard/work-hours/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Staff, WorkLog } from "@/types";
import api from "@/lib/api";
import WorkHoursModal from "@/components/work-hours/WorkHoursModal";

// ── helpers ────────────────────────────────────────────────────────────────

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

function fmtTime(timeStr: string): string {
  // "HH:MM:SS" → "HH:MM"
  return timeStr.slice(0, 5);
}

function hoursLabel(h: number): string {
  if (h % 1 === 0) return `${h} саат`;
  return `${Math.floor(h)} саат 30 мин`;
}

const PROFESSION_COLORS: Record<string, string> = {
  "Нанчы":  "bg-amber-100 text-amber-700",
  "Кассир": "bg-blue-100 text-blue-700",
  "Курьер": "bg-green-100 text-green-700",
};
function profColor(p: string) {
  return PROFESSION_COLORS[p] ?? "bg-stone-100 text-stone-600";
}


// ── sub-components ─────────────────────────────────────────────────────────

function StaffRow({
  staff,
  logs,
  onAddClick,
  onDeleteLog,
}: {
  staff: Staff;
  logs: WorkLog[];
  onAddClick: () => void;
  onDeleteLog: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const totalHours = logs.reduce((s, l) => s + l.hours_worked, 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Staff header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-2xl">
          👤
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-800 text-sm truncate">{staff.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profColor(staff.profession)}`}>
              {staff.profession}
            </span>
            <span className="text-xs text-stone-400">
              {staff.salary_hour} с/саат
            </span>
          </div>
        </div>

        {/* Hours summary */}
        {logs.length > 0 && (
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-stone-800">
              {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)} саат
            </span>
            <span className="text-xs text-stone-400">{logs.length} жазуу</span>
          </div>
        )}

        {/* Expand toggle */}
        {logs.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
            title="Жазууларды көрсөтүү"
          >
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Add button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex-shrink-0"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Убакыт кошуу</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Work logs list */}
      {expanded && logs.length > 0 && (
        <div className="border-t border-stone-100 divide-y divide-stone-50">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-5 py-3 group hover:bg-stone-50 transition-colors"
            >
              {/* Date */}
              <div className="w-24 flex-shrink-0">
                <span className="text-xs font-medium text-stone-600">{fmtDate(log.date)}</span>
              </div>

              {/* Time range */}
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-mono">
                  {fmtTime(log.start_time)}
                </span>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-stone-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-mono">
                  {fmtTime(log.end_time)}
                </span>
              </div>

              {/* Hours */}
              <span className="text-xs font-semibold text-amber-600 w-20 text-right">
                {hoursLabel(log.hours_worked)}
              </span>

              {/* Salary earned that shift */}
              <span className="text-xs text-stone-400 w-20 text-right hidden sm:block">
                {(log.hours_worked * parseFloat(staff.salary_hour)).toFixed(0)} сом
              </span>

              {/* Delete */}
              <button
                onClick={() => onDeleteLog(log.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Жок кылуу"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state when expanded */}
      {expanded && logs.length === 0 && (
        <div className="border-t border-stone-100 px-5 py-4 text-center text-sm text-stone-400">
          Жазуу жок
        </div>
      )}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export default function WorkHoursPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [staffRes, logsRes] = await Promise.all([
          api.get("/staff/"),
          api.get("/work-hours/"),
        ]);
        setStaff(staffRes.data);
        setLogs(logsRes.data);
      } catch {
        // silent — individual errors handled by interceptor
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Add log to local state after save
  const handleSaved = (log: WorkLog) => {
    setLogs((prev) => [log, ...prev]);
  };

  // Delete log
  const handleDeleteLog = async (id: number) => {
    try {
      await api.delete(`/work-hours/${id}/`);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Жок кылуу ишке ашкан жок. Кайра аракет кылыңыз.");
    }
  };

  // Group logs by staff id
  const logsByStaff = (staffId: number) =>
    logs.filter((l) => l.staff === staffId);

  // Totals for the summary bar
  const totalHoursAll = logs.reduce((s, l) => s + l.hours_worked, 0);
  const totalSalaryAll = logs.reduce(
    (s, l) =>
      s +
      l.hours_worked *
        parseFloat(
          staff.find((st) => st.id === l.staff)?.salary_hour ?? "0"
        ),
    0
  );

  return (
    <div className="max-w-3xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Иш убактысы</h1>
        <p className="text-stone-400 text-sm mt-1">
          Ар бир кызматкердин келүү жана кетүү убактысын жазыңыз
        </p>
      </div>

      {/* Summary cards */}
      {!loading && logs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-400 mb-1">Жалпы жазуулар</p>
            <p className="text-xl font-bold text-stone-800">{logs.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-400 mb-1">Жалпы саат</p>
            <p className="text-xl font-bold text-amber-600">
              {totalHoursAll % 1 === 0 ? totalHoursAll : totalHoursAll.toFixed(1)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-stone-400 mb-1">Болжолдуу эмгек акы</p>
            <p className="text-xl font-bold text-stone-800">
              {totalSalaryAll.toFixed(0)} <span className="text-sm font-normal text-stone-400">сом</span>
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-stone-400">
          <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Жүктөлүүдө...
        </div>
      )}

      {/* Empty — no staff */}
      {!loading && staff.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-stone-500 font-medium">Кызматкерлер жок</p>
          <p className="text-stone-400 text-sm mt-1">
            Алгач кызматкерлер бөлүмүнөн кызматкер кошуңуз
          </p>
        </div>
      )}

      {/* Staff list */}
      {!loading && staff.length > 0 && (
        <div className="space-y-3">
          {staff.map((s) => (
            <StaffRow
              key={s.id}
              staff={s}
              logs={logsByStaff(s.id)}
              onAddClick={() => setSelectedStaff(s)}
              onDeleteLog={handleDeleteLog}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedStaff && (
        <WorkHoursModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}