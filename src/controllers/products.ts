import { Request, Response } from "express";
import { ProductsService } from "../services/products.js";
import { ProductsRepository } from "../db/queries/products.js";
import { createProductSchema, ListProductsOptions, listProductsQuerySchema, updateProductSchema } from "../schemas.js";

const productsRepo = new ProductsRepository();
const productsService = new ProductsService(productsRepo);

export async function listProductsController(req: Request, res: Response): Promise<void> {
    const productsList = await productsService.listProducts(res.locals.validated);
    res.json({ products: productsList });
}

export async function createProductController(req: Request, res: Response): Promise<void> {
    const { name, price, description, stock } = res.locals.validated;
    const newProduct = await productsService.create(
        name, price, description, stock
    );
    res.json({ created: newProduct });
}

export async function getProductByIdController(req: Request, res: Response): Promise<void> {
    const product = await productsService.findById(req.params.productId as string)
    res.json({ found: product });
}

export async function deleteProductController(req: Request, res: Response): Promise<void> {
    const product = await productsService.deleteById(req.params.productId as string)
    res.json({ deleted: product });
}

export async function updateProductController(req: Request, res: Response): Promise<void> {
    const updated = await productsService.updateById(
        req.params.productId as string,
        res.locals.validated
    );
    res.json({ updated: updated });
}