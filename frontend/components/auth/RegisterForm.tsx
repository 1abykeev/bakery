// frontend/src/components/auth/RegisterForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { setTokens, setUser } from "@/lib/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas";
import { AuthResponse } from "@/types";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    try {
      const res = await api.post<AuthResponse>("/auth/register/", data);
      setTokens(res.data.tokens.access, res.data.tokens.refresh);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: Record<string, string[]> } };
      const errData = error.response?.data;
      if (errData) {
        const first = Object.values(errData)[0];
        setServerError(Array.isArray(first) ? first[0] : "Катталууда ката кетти");
      } else {
        setServerError("Катталууда ката кетти");
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Катталуу</h1>
      <p className="text-stone-500 mb-8">Акысыз аккаунт түзүңүз</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Аты</label>
            <input
              {...register("first_name")}
              placeholder="Айбек"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Фамилиясы</label>
            <input
              {...register("last_name")}
              placeholder="Уулу"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

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
          <label className="block text-sm font-medium text-stone-700 mb-1">Сырсөз</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Кеминде 8 белги"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Сырсөздү тастыктоо</label>
          <input
            {...register("confirm_password")}
            type="password"
            placeholder="Сырсөздү кайталаңыз"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition"
        >
          {isSubmitting ? "Аккаунт түзүлүүдө..." : "Катталуу"}
        </button>
      </form>

      <p className="text-center text-stone-500 mt-6 text-sm">
        Аккаунтуңуз барбы?{" "}
        <Link href="/login" className="text-amber-600 font-medium hover:text-amber-700">
          Кирүү
        </Link>
      </p>
    </div>
  );
}