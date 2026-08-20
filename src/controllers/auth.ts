import { Request, Response } from "express";
import * as z from "zod"
import { registerUser } from "../services/auth";

// Auth schemas
const RegisterSchema = z.object({
    name: z.string().min(8),
    email: z.email().min(8),
    password: z.string().min(8),
    confirmationPassword: z.string().min(8)
}).refine((data) => data.confirmationPassword === data.password, {
    message: "passwords do not match!"
});

const LoginSchema = z.object({
    email: z.email().min(8),
    password: z.string().min(8)
});

export async function registerController(req: Request, res: Response): Promise<void> {
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }

    const { email, password } = result.data;
    const user = await registerUser(email, password);
    res.status(201).json(user);
}

export async function loginController(req: Request, res: Response): Promise<void> {

    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }

    const { email, password } = result.data;
    // const user = await loginUser(email, password);
    res.status(200).json({ message: "Dummy login" });
}

export async function logoutController(req: Request, res: Response): Promise<void> {
    res.json({ message: "Dummy logout" });
}

export async function refreshTokenController(req: Request, res: Response): Promise<void> {
    res.json({ message: "Dummy refresh token" });
}

export async function getCurrentUserController(req: Request, res: Response): Promise<void> {
    res.json({ message: "Dummy get current user" });
}
