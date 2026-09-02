import { hash, verify } from "argon2";

export class PasswordService {
    async hashPassword(password: string) {
        return await hash(password);
    }

    async verifyPassword(
        passwordHash: string,
        password: string
    ) {
        return await verify(passwordHash, password);
    }
}