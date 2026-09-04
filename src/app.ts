import express from "express";
import cookieParser from "cookie-parser";
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
} from "./controllers/auth.js";
import {
    getProductsController,
    getProductByIdController,
    addProductByIdController
} from "./controllers/products.js";
import {
    getCartController,
    addItemToCartController,
    updateCartItemController,
    removeCartItemController,
    clearCartController
} from "./controllers/cart.js";
import { checkoutController } from "./controllers/checkout.js";
import {
    getOrdersController,
    getOrderByIdController
} from "./controllers/orders.js";
import {
    getPaymentByIdController,
    paymentWebhookController
} from "./controllers/payments.js";
import { authenticateMiddleware, authorizeRoleMiddleware, errorMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
// Routers
const apiRouter = express.Router();

const authRouter = express.Router();
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", authenticateMiddleware, logoutController);
authRouter.post("/refresh", authenticateMiddleware, refreshTokenController);

const productsRouter = express.Router();
productsRouter.use(authenticateMiddleware)
productsRouter.get("/", getProductsController);
productsRouter.post("/", authorizeRoleMiddleware(['admin']), addProductByIdController);
productsRouter.get("/:productId", getProductByIdController);

const cartRouter = express.Router();
cartRouter.get("/", getCartController);
cartRouter.post("/items", addItemToCartController);
cartRouter.post("/items/:productId", updateCartItemController);
cartRouter.delete("/items/:productId", removeCartItemController);
cartRouter.delete("/", clearCartController);

const checkoutRouter = express.Router();
checkoutRouter.post("/", checkoutController);

const ordersRouter = express.Router();
ordersRouter.get("/", getOrdersController);
ordersRouter.get("/:orderId", getOrderByIdController);

const paymentsRouter = express.Router();
paymentsRouter.get("/:paymentId", getPaymentByIdController);

const webhooksRouter = express.Router();
webhooksRouter.post("/payment", paymentWebhookController);

// Wire up routes
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/webhooks", webhooksRouter);

app.use("/api/v1", apiRouter);
app.use(errorMiddleware);

export default app;