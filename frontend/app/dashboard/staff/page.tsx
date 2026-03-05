// frontend/src/app/dashboard/staff/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Staff } from "@/types";
import StaffCard from "@/components/staff/StaffCard";
import StaffAddModal from "@/components/staff/StaffAddModal";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchStaff() {
    try {
      const res = await api.get("/staff/");
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Кызматкерди жок кылуу керекпи?")) return;
    try {
      await api.delete(`/staff/${id}/`);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Жок кылуу мүмкүн болгон жок.");
    }
  }

  function handleAdded(newStaff: Staff) {
    setStaffList((prev) => [newStaff, ...prev]);
    setShowModal(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Кызматкерлер</h1>
          <p className="text-stone-500 text-sm mt-1">
            {staffList.length} кызматкер катталган
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-amber-200"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Кызматкер кошуу
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && staffList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-stone-700 font-semibold text-lg">Кызматкер жок</p>
          <p className="text-stone-400 text-sm mt-1 mb-6">
            Биринчи кызматкерди кошуп баштаңыз
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Кызматкер кошуу
          </button>
        </div>
      )}

      {/* Staff grid */}
      {!loading && staffList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staffList.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <StaffAddModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}