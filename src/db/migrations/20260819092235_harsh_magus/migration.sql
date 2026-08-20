CREATE TYPE "order_status" AS ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('pending', 'succeeded', 'failed', 'cancelled');--> statement-breakpoint
CREATE TABLE "cartItems" (
	"cart_id" uuid,
	"product_id" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "cartItems_pkey" PRIMARY KEY("cart_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"order_id" uuid,
	"product_id" uuid,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10,2) NOT NULL,
	CONSTRAINT "orderItems_pkey" PRIMARY KEY("order_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'pending'::"order_status" NOT NULL,
	"total" numeric(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"amount" numeric(10,2) NOT NULL,
	"status" "payment_status" DEFAULT 'pending'::"payment_status" NOT NULL,
	"provider" varchar(100) NOT NULL,
	"provider_payment_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL UNIQUE,
	"description" text,
	"price" numeric(10,2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_cartitem_cartid" ON "cartItems" ("cart_id");--> statement-breakpoint
CREATE INDEX "idx_cartitem_productid" ON "cartItems" ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cart_userid" ON "carts" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orderitem_orderid" ON "orderItems" ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orderitem_productid" ON "orderItems" ("product_id");--> statement-breakpoint
CREATE INDEX "idx_order_userid" ON "orders" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_orderid" ON "payments" ("order_id");--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cart_id_carts_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;