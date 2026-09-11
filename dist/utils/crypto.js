import { createHash, randomBytes } from "node:crypto";
export class CryptoService {
    hashToken(token) {
        return createHash("sha256")
            .update(token)
            .digest("hex");
    }
    generateRandomToken(bytes = 32) {
        return randomBytes(bytes).toString("base64url");
    }
}
//# sourceMappingURL=crypto.js.map