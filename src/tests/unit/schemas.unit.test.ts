import { expect, it } from "vitest";
import { listProductsQuerySchema } from "../../schemas.js";

it("should pass", () => {
    const result = listProductsQuerySchema.safeParse({
        sort: "-price",
        inStock: "false",
        page: "2"
    });
    expect(result.success).toBeTruthy();
    expect(result.data).toMatchObject({
        sortBy: "price",
        sortOrder: "desc",
        inStock: false,
        limit: 10,
        offset: 10
    });
});