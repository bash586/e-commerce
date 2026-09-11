import { and, asc, desc, eq, gt, gte, ilike, lte, sql } from "drizzle-orm";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";
import { db as globalDb, DbType, TxType } from "../index.js";
import { NewProduct, Product, productsTable } from "../schema.js";
import { ListProductsOptions, productUpdates } from "../../schemas.js";


export class ProductsRepository {
    constructor(private db: DbType = globalDb) { }
    async findMany(options: ListProductsOptions): Promise<Product[]> {
        const filters = [];

        const search = options.search?.trim();

        if (search) {
            filters.push(
                ilike(productsTable.name, `%${search}%`)
            );
        }

        if (options.minPrice !== undefined) {
            filters.push(
                gte(productsTable.price, options.minPrice)
            );
        }

        if (options.maxPrice !== undefined) {
            filters.push(
                lte(productsTable.price, options.maxPrice)
            );
        }

        if (options.inStock !== undefined) {
            filters.push(
                options.inStock
                    ? gt(productsTable.stock, 0)
                    : eq(productsTable.stock, 0)
            );
        }

        const sortColumn =
            options.sortBy === "price"
                ? productsTable.price
                : productsTable.name;

        const orderStmt =
            options.sortOrder === "desc"
                ? desc(sortColumn)
                : asc(sortColumn);

        let query = this.db
            .select()
            .from(productsTable)
            .where(and(...filters))
            .orderBy(orderStmt, asc(productsTable.id))
            .$dynamic();

        if (options.limit !== undefined) {
            query = query.limit(options.limit);
        }

        if (options.offset !== undefined) {
            query = query.offset(options.offset);
        }

        return withDbErrors(() => query);
    }

    async findById(productId: string): Promise<Product | undefined> {
        const [product] = await withDbErrors(
            () => this.db.select()
                .from(productsTable)
                .where(eq(productsTable.id, productId))
        );
        return product;
    }
    async create(
        name: string,
        price: string,
        description: string,
        stock: number
    ): Promise<Product> {
        const product = expectFirstRow(await withDbErrors(
            () => this.db.insert(productsTable)
                .values(
                    { name, price, description, stock }
                )
                .returning()
        ));

        return product;
    }
    async deleteById(productId: string): Promise<Product | undefined> {
        const [product] = await withDbErrors(
            () => this.db.delete(productsTable)
                .where(eq(productsTable.id, productId))
                .returning()
        );
        return product;
    }

    async updateById(
        productId: string,
        updates: productUpdates
    ): Promise<Product | undefined> {
        if (Object.keys(updates).length === 0) {
            return await this.findById(productId);
        }
        const product = expectFirstRow(await withDbErrors(
            () => this.db.update(productsTable)
                .set(updates)
                .where(eq(productsTable.id, productId))
                .returning()
        ));

        return product;
    }
}
