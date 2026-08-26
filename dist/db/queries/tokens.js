"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRefreshToken = storeRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
const drizzle_orm_1 = require("drizzle-orm");
const index_1 = require("../index");
const schema_1 = require("../schema");
async function storeRefreshToken(userId, tokenHash, expiresAt) {
    const [token] = await index_1.db.insert(schema_1.refreshTokensTable)
        .values({
            userId,
            tokenHash,
            expiresAt
        })
        .returning();
    return token;
}
async function getRefreshToken(tokenHash) {
    const [token] = await index_1.db.select()
        .from(schema_1.refreshTokensTable)
        .where((0, drizzle_orm_1.eq)(schema_1.refreshTokensTable.tokenHash, tokenHash));
    return token;
}
async function deleteRefreshToken(tokenHash) {
    const [deleted] = await index_1.db.delete(schema_1.refreshTokensTable)
        .where((0, drizzle_orm_1.eq)(schema_1.refreshTokensTable.tokenHash, tokenHash))
        .returning();
    return deleted;
}
//# sourceMappingURL=tokens.js.map