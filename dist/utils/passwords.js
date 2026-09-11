import { hash, verify } from "argon2";
export class PasswordService {
    async hashPassword(password) {
        return await hash(password);
    }
    async verifyPassword(passwordHash, password) {
        return await verify(passwordHash, password);
    }
}
//# sourceMappingURL=passwords.js.map