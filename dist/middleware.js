"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const postgres_1 = require("./errors/postgres");
const http_1 = require("./errors/http");
async function errorMiddleware(err, req, res, next) {
    if (err instanceof postgres_1.PostgresError) {
        res.status(400).json({ error: err.message });
        return;
    }
    if (err instanceof http_1.HttpError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    console.error("Unhandled Exception:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
//# sourceMappingURL=middleware.js.map