import { Request, Response } from "express";

export function registerController(req: Request, res: Response): void {
    res.json({ message: "Dummy register" });
}

export function loginController(req: Request, res: Response): void {
    res.json({ message: "Dummy login" });
}

export function logoutController(req: Request, res: Response): void {
    res.json({ message: "Dummy logout" });
}

export function refreshTokenController(req: Request, res: Response): void {
    res.json({ message: "Dummy refresh token" });
}

export function getCurrentUserController(req: Request, res: Response): void {
    res.json({ message: "Dummy get current user" });
}
