import * as z from "zod";

// Auth schemas
export const RegisterSchema = z.object({
    name: z.string().min(8),
    email: z.email().min(8),
    password: z.string().min(8),
    confirmationPassword: z.string().min(8)
}).refine((data) => data.confirmationPassword === data.password, {
    message: "passwords do not match!"
});

export const LoginSchema = z.object({
    email: z.email().min(8),
    password: z.string().min(8)
});

export const JwtSchema = z.object({
    sub: z.string(),
    exp: z.number(),
    role: z.string(),
    email: z.string(),
});

export const createAdminInvitationSchema = z.object({
    email: z.string()
});

// products
export const createProductSchema = z
    .object({
        name: z.string().min(3).max(100),
        description: z.string().optional(),
        price: z
            .string()
            .regex(/^\d+(\.\d+)?$/, "invalid price")
            .refine(value => Number(value) > 0, "invalid price"),
        stock: z.coerce.number().int().nonnegative().default(0)
    });
export const listProductsQuerySchema = z
    .object({
        search: z.string().trim().optional(),
        minPrice: z.string().regex(/^\d+(\.\d+)?$/, "invalid price").optional(),
        maxPrice: z.string().regex(/^\d+(\.\d+)?$/, "invalid price").optional(),
        inStock: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
        sort: z.string().regex(/^([+-]?)(name|price)$/).optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
    })
    .transform(({ sort, page, limit, ...rest }) => {
        let sortBy: "name" | "price" | undefined;
        let sortOrder: "asc" | "desc" = "asc";

        if (sort) {
            sortOrder = sort.startsWith("-") ? "desc" : "asc";
            sortBy = sort.replace(/^[+-]/, "") as "name" | "price";
        }

        return {
            ...rest,
            limit,
            offset: (page - 1) * limit,
            ...(sortBy && { sortBy, sortOrder }),
        };
    });
export type ListProductsOptions = z.infer<typeof listProductsQuerySchema>;
export const updateProductSchema = z
    .object({
        name: z.string().min(3).max(100).optional(),
        description: z.string().optional(),
        price: z
            .string()
            .regex(/^\d+(\.\d+)?$/, "invalid price")
            .refine(value => Number(value) > 0, "invalid price")
            .optional(),
        stock: z.number().int().nonnegative().optional()
    })
    .refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
    });
export type productUpdates = z.infer<typeof updateProductSchema>;