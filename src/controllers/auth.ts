import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { RegisterSchema, LoginSchema } from "../schemas.js";
import { UnauthorizedError } from "../errors/http.js";
import { UserRepository } from "../db/queries/users.js";
import { TokenRepository } from "../db/queries/tokens.js";
import { PasswordService } from "../utils/passwords.js";
import { CryptoService } from "../utils/crypto.js";
import { TokenService } from "../services/token.js";
import { AuthService } from "../services/auth.js";

// --- Wire up dependencies ---
const tokenService = new TokenService(
    new TokenRepository(),
    new UserRepository(),
    new CryptoService(),
    config,
    jwt.sign
);

export const authService = new AuthService(
    new UserRepository(),
    new PasswordService(),
    tokenService
);

export async function registerController(req: Request, res: Response) {
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }

    const { email, password } = result.data;
    const authResponse = await authService.registerUser(email, password);

    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: config.jwt.expiresAtMs
    });

    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: config.jwt.refreshExpiresAtMs
    });

    res.status(201).json(authResponse);
}

export async function loginController(req: Request, res: Response): Promise<void> {

    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
        res.status(400).json({
            errors: errors
        });
        return;
    }

    const { email, password } = result.data;
    const authResponse = await authService.loginUser(email, password);

    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: config.jwt.expiresAtMs
    });
    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: config.jwt.refreshExpiresAtMs
    });

    res.status(200).json(authResponse);
}

export async function logoutController(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies.refresh_token;

    res.clearCookie("refresh_token");
    res.clearCookie("access_token");

    await tokenService.removeRefreshToken(rawRefreshToken);

    res.status(204).json();
}

export async function refreshTokenController(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies.refresh_token;
    if (!rawRefreshToken) throw new UnauthorizedError("Login required");

    const newTokens = await tokenService.refreshAccessToken(rawRefreshToken);

    res.cookie("access_token", newTokens.accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: config.jwt.expiresAtMs,
    });
    res.cookie("refresh_token", newTokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        maxAge: config.jwt.refreshExpiresAtMs,
    });

    res.status(200).json(newTokens);
}