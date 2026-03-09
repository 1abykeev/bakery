// frontend/src/hooks/useAuth.ts

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokens, getUser, isLoggedIn } from "@/lib/auth";
import { User } from "@/types";

export function useAuth(): {
  user: User | null;
  loggedIn: boolean;
  logout: () => void;
} {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setLoggedIn(isLoggedIn());
  }, []);

  function logout() {
    clearTokens();
    router.push("/login");
  }

  return { user, loggedIn, logout };
}