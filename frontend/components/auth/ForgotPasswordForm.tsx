// frontend/src/components/auth/ForgotPasswordForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import {
  forgotPasswordEmailSchema,
  forgotPasswordCodeSchema,
  resetPasswordSchema,
  ForgotPasswordEmailInput,
  ForgotPasswordCodeInput,
  ResetPasswordInput,
} from "@/lib/schemas";

type Step = 1 | 2 | 3;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ─── Step 1: Email ───────────────────────────────
  const emailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  async function onEmailSubmit(data: ForgotPasswordEmailInput) {
    setServerError("");
    try {
      await api.post("/auth/forgot-password/", { email: data.email });
      setEmail(data.email);
      setSuccessMsg("Код жөнөтүлдү. Сервер терминалын текшериңиз.");
      setStep(2);
    } catch {
      setServerError("Ката кетти. Кайра аракет кылыңыз.");
    }
  }

  // ─── Step 2: Code ────────────────────────────────
  const codeForm = useForm<ForgotPasswordCodeInput>({
    resolver: zodResolver(forgotPasswordCodeSchema),
  });

  async function onCodeSubmit(data: ForgotPasswordCodeInput) {
    setServerError("");
    try {
      await api.post("/auth/verify-reset-code/", { email, code: data.code });
      setSuccessMsg("");
      setStep(3);
    } catch {
      setServerError("Код туура эмес же мөөнөтү өтүп кеткен.");
    }
  }

  // ─── Step 3: New password ─────────────────────────
  const passwordForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onPasswordSubmit(data: ResetPasswordInput) {
    setServerError("");
    try {
      await api.post("/auth/reset-password/", {
        email,
        code: codeForm.getValues("code"),
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      router.push("/login");
    } catch {
      setServerError("Сырсөздү калыбына келтирүүдө ката кетти. Башынан баштаңыз.");
    }
  }

  const stepLabels = ["Email", "Код", "Жаңы сырсөз"];

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Сырсөздү калыбына келтирүү</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                step > i + 1
                  ? "bg-amber-500 text-white"
                  : step === i + 1
                  ? "bg-amber-500 text-white"
                  : "bg-stone-200 text-stone-400"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? "text-stone-800 font-medium" : "text-stone-400"}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={`h-px w-6 ${step > i + 1 ? "bg-amber-400" : "bg-stone-200"}`} />
            )}
          </div>
        ))}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
          {serverError}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
          {successMsg}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <p className="text-stone-500 text-sm">Аккаунтуңуздун emailин киргизиңиз.</p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              {...emailForm.register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{emailForm.formState.errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={emailForm.formState.isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {emailForm.formState.isSubmitting ? "Жөнөтүлүүдө..." : "Код алуу"}
          </button>
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
          <p className="text-stone-500 text-sm">
            Сервер терминалындагы 6 орундуу кодду киргизиңиз.
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Тастыктоо коду</label>
            <input
              {...codeForm.register("code")}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-center text-2xl tracking-widest"
            />
            {codeForm.formState.errors.code && (
              <p className="text-red-500 text-sm mt-1">{codeForm.formState.errors.code.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={codeForm.formState.isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {codeForm.formState.isSubmitting ? "Текшерилүүдө..." : "Тастыктоо"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-stone-400 text-sm hover:text-stone-600">
            ← Артка
          </button>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <p className="text-stone-500 text-sm">Жаңы сырсөз ойлоп табыңыз.</p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Жаңы сырсөз</label>
            <input
              {...passwordForm.register("new_password")}
              type="password"
              placeholder="Кеминде 8 белги"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {passwordForm.formState.errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.new_password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Сырсөздү тастыктоо</label>
            <input
              {...passwordForm.register("confirm_password")}
              type="password"
              placeholder="Сырсөздү кайталаңыз"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {passwordForm.formState.errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.confirm_password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {passwordForm.formState.isSubmitting ? "Сакталууда..." : "Сырсөздү сактоо"}
          </button>
        </form>
      )}

      <p className="text-center text-stone-500 mt-6 text-sm">
        <Link href="/login" className="text-amber-600 font-medium hover:text-amber-700">
          ← Кирүүгө кайтуу
        </Link>
      </p>
    </div>
  );
}