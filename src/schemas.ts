import * as z from "zod";

// Auth schemas
export const RegisterSchema = z.object({
    name: z.string().min(8),
    email: z.email().min(8),
    password: z.string().min(8),
    confirmationPassword: z.string().min(8)
}).refine((data) => data.confirmationPassword === data.password, {
    message: "passwords do not match!"
});

export const LoginSchema = z.object({
    email: z.email().min(8),
    password: z.string().min(8),
    role: z.string()
});

export const JwtSchema = z.object({
    sub: z.string(),
    exp: z.number(),
    role: z.string()
});