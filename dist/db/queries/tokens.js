import { eq } from "drizzle-orm";
import { db as globalDb } from "../index.js";
import { refreshTokensTable } from "../schema.js";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";
export class TokenRepository {
    db;
    constructor(db = globalDb) {
        this.db = db;
    }
    async storeRefreshToken(userId, tokenHash, expiresAt) {
        const token = expectFirstRow(await withDbErrors(() => this.db.insert(refreshTokensTable)
            .values({
            userId,
            tokenHash,
            expiresAt
        })
            .returning()));
        return token;
    }
    async getRefreshToken(tokenHash) {
        const [token] = await withDbErrors(() => this.db.select()
            .from(refreshTokensTable)
            .where(eq(refreshTokensTable.tokenHash, tokenHash)));
        return token;
    }
    async deleteRefreshToken(tokenHash) {
        const [deleted] = await withDbErrors(() => this.db.delete(refreshTokensTable)
            .where(eq(refreshTokensTable.tokenHash, tokenHash))
            .returning());
        return deleted;
    }
}
//# sourceMappingURL=tokens.js.map