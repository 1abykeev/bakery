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
      <main
        className="flex-1 ml-64 p-8"
        style={{
          backgroundColor: "#F7F6F3",
          backgroundImage: [
            "linear-gradient(to bottom, #F7F6F3 25%, rgba(247,246,243,0.85) 55%, rgba(247,246,243,0.15) 100%)",
            "url('/bakery-bg.jpg')",
          ].join(", "),
          backgroundPosition: "center, bottom center",
          backgroundRepeat:   "no-repeat, no-repeat",
          backgroundSize:     "cover, cover",
        }}
      >
        {children}
      </main>
    </div>
  );
}