import { numeric, pgTable, text, uuid, varchar, integer, primaryKey, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    email: varchar({ length: 255 })
        .notNull()
        .unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull()
});

export const productsTable = pgTable("products", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    description: text(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    stock: integer().notNull().default(0)
});

export const cartsTable = pgTable("carts", {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => usersTable.id, {
            onDelete: "cascade"
        })
        .notNull()
}, (table) => [
    uniqueIndex("idx_cart_userid").on(table.userId)
]);

export const cartItemsTable = pgTable("cartItems", {
    cartId: uuid("cart_id")
        .references(() => cartsTable.id, { onDelete: "cascade" })
        .notNull(),
    productId: uuid("product_id")
        .references(() => productsTable.id, { onDelete: "cascade" })
        .notNull(),
    quantity: integer().default(1).notNull()
}, (table) => [
    primaryKey({ columns: [table.cartId, table.productId] }),
    index("idx_cartitem_cartid").on(table.cartId),
    index("idx_cartitem_productid").on(table.productId)
]);
const orderStatus = pgEnum("order_status", [
    "pending", "confirmed", "shipped", "delivered", "cancelled"
]);

export const ordersTable = pgTable("orders", {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    status: orderStatus().default("pending").notNull(),
    total: numeric({ precision: 10, scale: 2 }).notNull()
}, (table) => [
    index("idx_order_userid").on(table.userId)
]);

export const orderItemsTable = pgTable("orderItems", {
    orderId: uuid("order_id")
        .references(() => ordersTable.id, { onDelete: "cascade" })
        .notNull(),
    productId: uuid("product_id")
        .references(() => productsTable.id, { onDelete: "cascade" })
        .notNull(),
    quantity: integer().notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull()
}, (table) => [
    primaryKey({ columns: [table.orderId, table.productId] }),
    index("idx_orderitem_orderid").on(table.orderId),
    index("idx_orderitem_productid").on(table.productId)
]);

const paymentStatus = pgEnum("payment_status", [
    "pending", "succeeded", "failed", "cancelled"
]);
export const paymentsTable = pgTable("payments", {
    id: uuid().defaultRandom().primaryKey(),
    orderId: uuid("order_id")
        .references(() => ordersTable.id, { onDelete: "cascade" })
        .notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    status: paymentStatus().default("pending").notNull(),
    provider: varchar({ length: 100 }).notNull(),
    providerPaymentId: varchar("provider_payment_id", { length: 255 }).notNull()
}, (table) => [
    index("idx_payment_orderid").on(table.orderId)
]);