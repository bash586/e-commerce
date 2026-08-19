import { Request, Response } from "express";

export function getPaymentByIdController(req: Request, res: Response): void {
    res.json({ message: `Dummy get payment ${req.params.paymentId}` });
}

export function paymentWebhookController(req: Request, res: Response): void {
    res.json({ message: "Dummy payment webhook" });
}
