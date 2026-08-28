"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
exports.authenticateMiddleware = authenticateMiddleware;
const postgres_1 = require("./errors/postgres");
const http_1 = require("./errors/http");
const jsonwebtoken_1 = require("jsonwebtoken");
const schemas_1 = require("./schemas");
const config_1 = require("./config");
async function errorMiddleware(err, req, res, next) {
    if (err instanceof postgres_1.PostgresError) {
        if (err instanceof postgres_1.TransientDbError) {
            res.setHeader("Retry-After", "10");
            res.status(503).json({ error: "service is down, retry later" });
            return;
        }
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof http_1.HttpError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else {
        console.error("Unhandled Exception:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function authenticateMiddleware(req, res, next) {
    const accessToken = req.cookies.access_token;
    if (!accessToken)
        throw new http_1.UnauthorizedError("Login required");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(accessToken, config_1.config.jwt.secret, {
            algorithms: ["HS256"],
            issuer: "ecommerce-api",
        });
        const payload = schemas_1.JwtSchema.parse(decoded);
        req.userId = payload.sub;
        next();
    }
    catch {
        throw new http_1.UnauthorizedError("Invalid or expired token");
    }
}
//# sourceMappingURL=middleware.js.map