"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = hashToken;
exports.generateRandomToken = generateRandomToken;
const node_crypto_1 = require("node:crypto");
function hashToken(token) {
    return (0, node_crypto_1.createHash)("sha256")
        .update(token)
        .digest("hex");
}
function generateRandomToken(bytes = 32) {
    return (0, node_crypto_1.randomBytes)(bytes).toString("base64url");
}
//# sourceMappingURL=crypto.js.map