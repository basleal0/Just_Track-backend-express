// src/schemas/auth.schema.ts
import { z } from "zod";
export const signupSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters"),
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .trim(),
});
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(1, "Password is required"),
});
//# sourceMappingURL=auth.schema.js.map