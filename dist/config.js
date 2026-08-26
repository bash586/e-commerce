"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
process.loadEnvFile("./.env");
;
exports.config = {
    env: process.env.NODE_ENV || "development",
    port: Number(envOrThrow("PORT")),
    db: {
        url: envOrThrow("DATABASE_URL")
    },
    jwt: {
        secret: envOrThrow("JWT_SECRET"),
        expiresAtMs: envOrThrow("JWT_EXPIRES_AT"),
        refreshExpiresAtMs: envOrThrow("JWT_REFRESH_EXPIRES_AT")
    },
};
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} can not be found`);
    }
    return value;
}
//# sourceMappingURL=config.js.map