import { Request, Response } from "express";

export function getProductsController(req: Request, res: Response): void {
    res.json({ message: "Dummy get products" });
}

export function getProductByIdController(req: Request, res: Response): void {
    res.json({ message: `Dummy get product ${req.params.productId}` });
}
