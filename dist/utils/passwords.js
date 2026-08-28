"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const argon2_1 = require("argon2");
async function hashPassword(password) {
    return await (0, argon2_1.hash)(password);
}
async function verifyPassword(passwordHash, password) {
    return await (0, argon2_1.verify)(passwordHash, password);
}
//# sourceMappingURL=passwords.js.map