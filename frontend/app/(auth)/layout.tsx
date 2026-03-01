// frontend/src/app/(auth)/layout.tsx

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50">
      <Navbar />
      <div className="flex flex-col justify-center py-12 px-6 pt-28">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}