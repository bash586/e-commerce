import { Request, Response } from "express";

export function getOrdersController(req: Request, res: Response): void {
    res.json({ message: "Dummy get orders" });
}

export function getOrderByIdController(req: Request, res: Response): void {
    res.json({ message: `Dummy get order ${req.params.orderId}` });
}
