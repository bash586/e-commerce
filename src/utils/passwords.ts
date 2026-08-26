import { hash, verify } from "argon2";

export async function hashPassword(password: string) {
    return await hash(password);
}

export async function verifyPassword(
    passwordHash: string,
    password: string
) {
    return await verify(passwordHash, password);
}