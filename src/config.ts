process.loadEnvFile("./.env");
interface Config {
    env: string;
    port: number;
    db: {
        url: String;
    }
    jwt: {
        secret: string,
        expiresAtMs: string,
        refreshExpiresAtMs: string
    }
};

export const config = {
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

function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} can not be found`);
    }
    return value;
}