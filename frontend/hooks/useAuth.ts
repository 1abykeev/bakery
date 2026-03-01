// frontend/src/hooks/useAuth.ts

"use client";

import { useRouter } from "next/navigation";
import { clearTokens, getUser, isLoggedIn } from "@/lib/auth";
import { User } from "@/types";

export function useAuth(): {
  user: User | null;
  loggedIn: boolean;
  logout: () => void;
} {
  const router = useRouter();
  const loggedIn = typeof window !== "undefined" ? isLoggedIn() : false;
  const user = typeof window !== "undefined" ? getUser() : null;

  function logout() {
    clearTokens();
    router.push("/login");
  }

  return { user, loggedIn, logout };
}