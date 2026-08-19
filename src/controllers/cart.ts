import { Request, Response } from "express";

export function getCartController(req: Request, res: Response): void {
    res.json({ message: "Dummy get cart" });
}

export function addItemToCartController(req: Request, res: Response): void {
    res.json({ message: "Dummy add item to cart" });
}

export function updateCartItemController(req: Request, res: Response): void {
    res.json({ message: `Dummy update cart item ${req.params.productId}` });
}

export function removeCartItemController(req: Request, res: Response): void {
    res.json({ message: `Dummy remove cart item ${req.params.productId}` });
}

export function clearCartController(req: Request, res: Response): void {
    res.json({ message: "Dummy clear cart" });
}
