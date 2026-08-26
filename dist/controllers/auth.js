"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.refreshTokenController = refreshTokenController;
exports.getCurrentUserController = getCurrentUserController;
const z = __importStar(require("zod"));
const auth_1 = require("../services/auth");
const config_1 = require("../config");
const jsonwebtoken_1 = require("jsonwebtoken");
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
async function registerController(req, res) {
    const result = RegisterSchema.safeParse(req.body);
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
    const result = LoginSchema.safeParse(req.body);
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
    const tokenHash = req.signedCookies.refresh_token;
    const accessToken = req.signedCookies.access_token;
    const jwtPayload = (0, jsonwebtoken_1.decode)(accessToken, { json: true });
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    //TODO: test manually how jwt.subject can be accessed
    await (0, auth_1.logoutUser)(jwtPayload?.subject, tokenHash);
    res.status(204).json();
}
async function refreshTokenController(req, res) {
    res.json({ message: "Dummy refresh token" });
}
async function getCurrentUserController(req, res) {
    res.json({ message: "Dummy get current user" });
}
//# sourceMappingURL=auth.js.map