// frontend/src/components/work-hours/WorkHoursModal.tsx

"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Staff, WorkLog } from "@/types";
import api from "@/lib/api";

interface Props {
  staff: Staff;
  onClose: () => void;
  onSaved: (log: WorkLog) => void;
}

// Generate time slots: 00:00, 00:30, 01:00 ... 23:30
function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots(); // ["00:00","00:30","01:00",...,"23:30"]

// Convert "HH:MM" → minutes since midnight (for comparison)
function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Display "HH:MM" nicely — keep as-is
function fmtTime(t: string): string {
  return t;
}

// "HH:MM" → "HH:MM:00" for Django TimeField
function toApiTime(t: string): string {
  return `${t}:00`;
}

export default function WorkHoursModal({ staff, onClose, onSaved }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // End time slots: only times AFTER the selected start time
  const endSlots = TIME_SLOTS.filter(
    (t) => toMinutes(t) > toMinutes(startTime)
  );

  // If current endTime is no longer valid after startTime change, reset it
  const safeEndTime =
    toMinutes(endTime) > toMinutes(startTime)
      ? endTime
      : endSlots[0] ?? "23:30";

  const hoursPreview =
    (toMinutes(safeEndTime) - toMinutes(startTime)) / 60;

  const handleStartChange = (val: string) => {
    setStartTime(val);
    // Auto-push endTime forward if it's now invalid
    if (toMinutes(val) >= toMinutes(safeEndTime)) {
      const next = TIME_SLOTS.find((t) => toMinutes(t) > toMinutes(val));
      setEndTime(next ?? "23:30");
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        staff: staff.id,
        date: date.toISOString().split("T")[0], // "YYYY-MM-DD"
        start_time: toApiTime(startTime),
        end_time: toApiTime(safeEndTime),
      };
      const res = await api.post("/work-hours/", payload);
      onSaved(res.data);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string; end_time?: string[] } } };
      setError(
        e.response?.data?.detail ||
          e.response?.data?.end_time?.[0] ||
          "Ката кетти. Кайра аракет кылыңыз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-[#1C1917] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-widest mb-1">
                Иш убактысы
              </p>
              <h2 className="text-white font-semibold text-lg leading-tight">
                {staff.name}
              </h2>
              <p className="text-white/40 text-sm">{staff.profession}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Күн
            </label>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => { if (d) setDate(d); }}
              maxDate={new Date()}
              dateFormat="dd.MM.yyyy"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
              wrapperClassName="w-full"
            />
          </div>

          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start time */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Башталуу
              </label>
              <div className="relative">
                <select
                  value={startTime}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
                >
                  {TIME_SLOTS.slice(0, -1).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* End time */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Бүтүү
              </label>
              <div className="relative">
                <select
                  value={safeEndTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
                >
                  {endSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hours preview */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-stone-600">Иш убактысы</span>
            <span className="text-amber-700 font-bold text-lg">
              {hoursPreview % 1 === 0
                ? `${hoursPreview} саат`
                : `${Math.floor(hoursPreview)}с ${hoursPreview % 1 === 0.5 ? "30м" : ""}`}
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Жокко чыгаруу
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Сакталууда..." : "Сактоо"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}