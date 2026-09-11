const envFilePath = (process.env.NODE_ENV === "test") ? "./.env.test" : "./.env";
process.loadEnvFile(envFilePath);
;
export const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(envOrThrow("PORT")),
    baseUrl: envOrThrow("API_BASE_URL"),
    db: {
        url: envOrThrow("DATABASE_URL")
    },
    jwt: {
        secret: envOrThrow("JWT_SECRET"),
        expiresAtMs: Number(envOrThrow("JWT_EXPIRES_AT")),
        refreshExpiresAtMs: Number(envOrThrow("JWT_REFRESH_EXPIRES_AT"))
    },
    adminInvites: {
        expiresAtMs: Number(envOrThrow("ADMIN_INVITE_EXPIRES_AT"))
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