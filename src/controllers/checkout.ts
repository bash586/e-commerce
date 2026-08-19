import { Request, Response } from "express";

export function checkoutController(req: Request, res: Response): void {
    res.json({ message: "Dummy checkout" });
}
