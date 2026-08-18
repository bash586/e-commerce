process.loadEnvFile("./.env");

export const config = {
    port: Number(envOrThrow("PORT"))
};

function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} can not be found`);
    }
    return value;
}