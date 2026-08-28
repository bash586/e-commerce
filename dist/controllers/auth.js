"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.refreshTokenController = refreshTokenController;
const auth_1 = require("../services/auth");
const config_1 = require("../config");
const schemas_1 = require("../schemas");
const http_1 = require("../errors/http");
async function registerController(req, res) {
    const result = schemas_1.RegisterSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }
    const { email, password } = result.data;
    const authResponse = await (0, auth_1.registerUser)(email, password);
    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        sameSite: "strict",
        maxAge: Number(config_1.config.jwt.expiresAtMs)
    });
    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        sameSite: "strict",
        maxAge: Number(config_1.config.jwt.refreshExpiresAtMs)
    });
    res.status(201).json(authResponse);
}
async function loginController(req, res) {
    const result = schemas_1.LoginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });
        return;
    }
    const { email, password } = result.data;
    const authResponse = await (0, auth_1.loginUser)(email, password);
    res.cookie("access_token", authResponse.accessToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        maxAge: Number(config_1.config.jwt.expiresAtMs)
    });
    res.cookie("refresh_token", authResponse.refreshToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        maxAge: Number(config_1.config.jwt.refreshExpiresAtMs)
    });
    res.status(200).json(authResponse);
}
async function logoutController(req, res) {
    const rawRefreshToken = req.cookies.refresh_token;
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    if (!req.userId)
        throw new http_1.UnauthorizedError("Invalid or expired token");
    await (0, auth_1.logoutUser)(req.userId, rawRefreshToken);
    res.status(204).json();
}
async function refreshTokenController(req, res) {
    const rawRefreshToken = req.cookies.refresh_token;
    if (!rawRefreshToken)
        throw new http_1.UnauthorizedError("Login required");
    const newTokens = await (0, auth_1.refreshAccessToken)(rawRefreshToken);
    res.cookie("access_token", newTokens.accessToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        maxAge: Number(config_1.config.jwt.expiresAtMs),
    });
    res.cookie("refresh_token", newTokens.refreshToken, {
        httpOnly: true,
        secure: config_1.config.env === "production",
        maxAge: Number(config_1.config.jwt.refreshExpiresAtMs),
    });
    res.status(200).json(newTokens);
}
//# sourceMappingURL=auth.js.map