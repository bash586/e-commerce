import { Request, Response } from "express";
import * as z from "zod"
import { loginUser, logoutUser, registerUser } from "../services/auth";
import { config } from "../config";
import { decode } from "jsonwebtoken";

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
    const authResponse = await registerUser(email, password);

    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: Number(config.jwt.expiresAtMs)
    });

    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: Number(config.jwt.refreshExpiresAtMs)
    });

    res.status(201).json(authResponse);
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
    const authResponse = await loginUser(email, password);

    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: Number(config.jwt.expiresAtMs)
    });

    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: Number(config.jwt.refreshExpiresAtMs)
    });
    res.status(200).json(authResponse);
}

export async function logoutController(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;
    const jwtPayload = decode(accessToken, { json: true });
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    //TODO: test manually how jwt.subject can be accessed
    await logoutUser(jwtPayload?.sub!, rawRefreshToken);

    res.status(204).json();
}

export async function refreshTokenController(req: Request, res: Response): Promise<void> {
    res.json({ message: "Dummy refresh token" });
}

export async function getCurrentUserController(req: Request, res: Response): Promise<void> {
    res.json({ message: "Dummy get current user" });
}
