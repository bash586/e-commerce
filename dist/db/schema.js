"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokensTable = exports.paymentsTable = exports.paymentStatus = exports.orderItemsTable = exports.ordersTable = exports.orderStatus = exports.cartItemsTable = exports.cartsTable = exports.productsTable = exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    email: (0, pg_core_1.varchar)({ length: 255 })
        .notNull()
        .unique(),
    passwordHash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull()
});
exports.productsTable = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)(),
    price: (0, pg_core_1.numeric)({ precision: 10, scale: 2 }).notNull(),
    stock: (0, pg_core_1.integer)().notNull().default(0)
});
exports.cartsTable = (0, pg_core_1.pgTable)("carts", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => exports.usersTable.id, {
        onDelete: "cascade"
    })
        .notNull()
}, (table) => [
    (0, pg_core_1.uniqueIndex)("idx_cart_userid").on(table.userId)
]);
exports.cartItemsTable = (0, pg_core_1.pgTable)("cartItems", {
    cartId: (0, pg_core_1.uuid)("cart_id")
        .references(() => exports.cartsTable.id, { onDelete: "cascade" })
        .notNull(),
    productId: (0, pg_core_1.uuid)("product_id")
        .references(() => exports.productsTable.id, { onDelete: "cascade" })
        .notNull(),
    quantity: (0, pg_core_1.integer)().default(1).notNull()
}, (table) => [
    (0, pg_core_1.primaryKey)({ columns: [table.cartId, table.productId] }),
    (0, pg_core_1.index)("idx_cartitem_cartid").on(table.cartId),
    (0, pg_core_1.index)("idx_cartitem_productid").on(table.productId)
]);
exports.orderStatus = (0, pg_core_1.pgEnum)("order_status", [
    "pending", "confirmed", "shipped", "delivered", "cancelled"
]);
exports.ordersTable = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => exports.usersTable.id, { onDelete: "cascade" })
        .notNull(),
    status: (0, exports.orderStatus)("status").default("pending").notNull(),
    total: (0, pg_core_1.numeric)({ precision: 10, scale: 2 }).notNull()
}, (table) => [
    (0, pg_core_1.index)("idx_order_userid").on(table.userId)
]);
exports.orderItemsTable = (0, pg_core_1.pgTable)("orderItems", {
    orderId: (0, pg_core_1.uuid)("order_id")
        .references(() => exports.ordersTable.id, { onDelete: "cascade" })
        .notNull(),
    productId: (0, pg_core_1.uuid)("product_id")
        .references(() => exports.productsTable.id, { onDelete: "cascade" })
        .notNull(),
    quantity: (0, pg_core_1.integer)().notNull(),
    unitPrice: (0, pg_core_1.numeric)("unit_price", { precision: 10, scale: 2 }).notNull()
}, (table) => [
    (0, pg_core_1.primaryKey)({ columns: [table.orderId, table.productId] }),
    (0, pg_core_1.index)("idx_orderitem_orderid").on(table.orderId),
    (0, pg_core_1.index)("idx_orderitem_productid").on(table.productId)
]);
exports.paymentStatus = (0, pg_core_1.pgEnum)("payment_status", [
    "pending", "succeeded", "failed", "cancelled"
]);
exports.paymentsTable = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    orderId: (0, pg_core_1.uuid)("order_id")
        .references(() => exports.ordersTable.id, { onDelete: "cascade" })
        .notNull(),
    amount: (0, pg_core_1.numeric)({ precision: 10, scale: 2 }).notNull(),
    status: (0, exports.paymentStatus)("status").default("pending").notNull(),
    provider: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    providerPaymentId: (0, pg_core_1.varchar)("provider_payment_id", { length: 255 }).notNull()
}, (table) => [
    (0, pg_core_1.index)("idx_payment_orderid").on(table.orderId)
]);
exports.refreshTokensTable = (0, pg_core_1.pgTable)("refresh_tokens", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    tokenHash: (0, pg_core_1.varchar)("token_hash")
        .notNull()
        .unique(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at", { withTimezone: true })
        .notNull()
}, (table) => [
    (0, pg_core_1.index)("idx_refreshtoken_userid").on(table.userId)
]);
//# sourceMappingURL=schema.js.map