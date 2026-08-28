import { Request, Response } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth";
import { config } from "../config";
import { RegisterSchema, LoginSchema } from "../schemas";
import { UnauthorizedError } from "../errors/http";

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
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    if (!req.userId) throw new UnauthorizedError("Invalid or expired token");
    await logoutUser(req.userId, rawRefreshToken);

    res.status(204).json();
}

export async function refreshTokenController(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies.refresh_token;
    if (!rawRefreshToken) throw new UnauthorizedError("Login required");

    const newTokens = await refreshAccessToken(rawRefreshToken);
    res.cookie("access_token", newTokens.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: Number(config.jwt.expiresAtMs),
    });

    res.cookie("refresh_token", newTokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: Number(config.jwt.refreshExpiresAtMs),
    });

    res.status(200).json(newTokens);
}