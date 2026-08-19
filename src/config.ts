process.loadEnvFile("./.env");
interface Config {
    port: number;
    db: {
        url: String;
    }
};

export const config = {
    port: Number(envOrThrow("PORT")),
    db: {
        url: envOrThrow("DATABASE_URL")
    }
};

function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} can not be found`);
    }
    return value;
}