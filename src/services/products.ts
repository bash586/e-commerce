import { ProductsRepository } from "../db/queries/products.js";
import { Product } from "../db/schema.js";
import { ListProductsOptions, productUpdates } from "../schemas.js";

export class ProductsService {
    constructor(
        private productsRepo: ProductsRepository,
    ) { }
    async listProducts(queryParams: ListProductsOptions) {
        return await this.productsRepo.findMany(queryParams);
    }
    async findById(productId: string) {
        return await this.productsRepo.findById(productId);
    }
    async create(
        name: string,
        price: string,
        description: string = "",
        stock: number = 0
    ): Promise<Product> {
        return await this.productsRepo.create(
            name, price, description, stock
        );
    }
    async deleteById(productId: string): Promise<Product | undefined> {
        return await this.productsRepo.deleteById(productId);
    }
    async updateById(
        productId: string,
        updates: productUpdates,

    ) {
        return await this.productsRepo.updateById(
            productId, updates
        )
    }
}