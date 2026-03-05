// frontend/src/components/staff/StaffCard.tsx

"use client";

import { Staff } from "@/types";

interface Props {
  staff: Staff;
  onDelete: (id: number) => void;
}

const PROFESSION_COLORS: Record<string, string> = {
  default: "bg-stone-100 text-stone-600",
  Нанчы: "bg-amber-100 text-amber-700",
  Кассир: "bg-blue-100 text-blue-700",
  Курьер: "bg-green-100 text-green-700",
  Менеджер: "bg-purple-100 text-purple-700",
};

function getProfessionColor(profession: string) {
  return PROFESSION_COLORS[profession] || PROFESSION_COLORS.default;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function StaffCard({ staff, onDelete }: Props) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 hover:shadow-md hover:shadow-stone-100 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
            {getInitials(staff.name)}
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-sm">{staff.name}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${getProfessionColor(staff.profession)}`}>
              {staff.profession}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(staff.id)}
          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all duration-150"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-2 pt-3 border-t border-stone-50">
        <div className="flex items-center gap-2 text-stone-500">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm">{staff.phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-500">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Саатына</span>
          </div>
          <span className="text-sm font-bold text-amber-600">{staff.salary_hour} сом</span>
        </div>
      </div>
    </div>
  );
}