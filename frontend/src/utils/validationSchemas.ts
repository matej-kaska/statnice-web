import { z } from "zod";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailSchema = z
  .string()
  .nonempty("VALIDATION.REQUIRED")
  .email("VALIDATION.EMAIL")
  .regex(emailRegex, "VALIDATION.EMAIL")
  .max(320, "VALIDATION.EMAIL");

export const passwordSchema = z
  .string()
  .nonempty("VALIDATION.REQUIRED")
  .min(8, "VALIDATION.PASSWORD_MIN")
  .max(100, "VALIDATION.PASSWORD_MAX");

export const firstNameSchema = z
  .string()
  .nonempty("VALIDATION.REQUIRED")
  .max(100, "VALIDATION.FIRST_NAME_MAX");

export const lastNameSchema = z
  .string()
  .nonempty("VALIDATION.REQUIRED")
  .max(100, "VALIDATION.LAST_NAME_MAX");

export const confirmPasswordSchema = z
  .string()
  .nonempty("VALIDATION.REQUIRED");

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "VALIDATION.CONFIRM_PASSWORD",
  });
