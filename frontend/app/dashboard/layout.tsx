// frontend/src/app/dashboard/layout.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import DashboardNav from "@/components/dashboard-nav/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#F7F6F3]">
      <DashboardNav />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}