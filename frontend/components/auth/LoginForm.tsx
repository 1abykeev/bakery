// frontend/src/components/auth/LoginForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setTokens, setUser } from "@/lib/auth";
import { loginSchema, LoginInput } from "@/lib/schemas";
import { AuthResponse } from "@/types";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      const res = await api.post<AuthResponse>("/auth/login/", data);
      setTokens(res.data.tokens.access, res.data.tokens.refresh);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const message = error.response?.data?.detail || "Кирүүдө ката кетти";
      alert(message);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Кирүү</h1>
      <p className="text-stone-500 mb-8">Кайра келгениңизге кош келиңиз!</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-stone-700">Сырсөз</label>
            <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700">
              Сырсөздү унуттуңузбу?
            </Link>
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition"
        >
          {isSubmitting ? "Кирүүдө..." : "Кирүү"}
        </button>
      </form>

      <p className="text-center text-stone-500 mt-6 text-sm">
        Аккаунтуңуз жокпу?{" "}
        <Link href="/register" className="text-amber-600 font-medium hover:text-amber-700">
          Катталуу
        </Link>
      </p>
    </div>
  );
}