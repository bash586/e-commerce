"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
process.loadEnvFile("./.env");
;
exports.config = {
    port: Number(envOrThrow("PORT")),
    db: {
        url: envOrThrow("DATABASE_URL")
    }
};
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} can not be found`);
    }
    return value;
}
//# sourceMappingURL=config.js.map