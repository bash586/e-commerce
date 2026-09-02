import { createHash, randomBytes } from "node:crypto";

export class CryptoService {
    hashToken(token: string): string {
        return createHash("sha256")
            .update(token)
            .digest("hex");
    }

    generateRandomToken(bytes: number = 32): string {
        return randomBytes(bytes).toString("base64url");
    }
}