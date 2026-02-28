// frontend/src/app/(auth)/layout.tsx

import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 flex flex-col justify-center py-12 px-6">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold text-amber-700">
          Sweetflow
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}