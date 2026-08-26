import express from "express";
import cookieParser from "cookie-parser";
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
    getCurrentUserController
} from "./controllers/auth";
import {
    getProductsController,
    getProductByIdController
} from "./controllers/products";
import {
    getCartController,
    addItemToCartController,
    updateCartItemController,
    removeCartItemController,
    clearCartController
} from "./controllers/cart";
import { checkoutController } from "./controllers/checkout";
import {
    getOrdersController,
    getOrderByIdController
} from "./controllers/orders";
import {
    getPaymentByIdController,
    paymentWebhookController
} from "./controllers/payments";
import { errorMiddleware } from "./middleware";

const app = express();
app.use(express.json());
app.use(cookieParser());
// Routers
const apiRouter = express.Router();

const authRouter = express.Router();
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh", refreshTokenController);
authRouter.get("/me", getCurrentUserController);

const productsRouter = express.Router();
productsRouter.get("/", getProductsController);
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