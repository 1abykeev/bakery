// frontend/src/lib/schemas.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "Введите имя"),
    last_name: z.string().min(1, "Введите фамилию"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(8, "Минимум 8 символов"),
    confirm_password: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
  });

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

export const forgotPasswordCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Код должен состоять из 6 цифр")
    .regex(/^\d+$/, "Только цифры"),
});

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Минимум 8 символов"),
    confirm_password: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>;
export type ForgotPasswordCodeInput = z.infer<typeof forgotPasswordCodeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;