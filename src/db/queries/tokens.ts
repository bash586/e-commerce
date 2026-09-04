import { eq } from "drizzle-orm";
import { db as globalDb, DbType, TxType } from "../index.js";
import { RefreshToken, refreshTokensTable } from "../schema.js";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";


export class TokenRepository {
    constructor(private db: DbType = globalDb) { }

    async storeRefreshToken(
        userId: string, tokenHash: string, expiresAt: Date
    ): Promise<RefreshToken> {
        const token = expectFirstRow(
            await withDbErrors(
                () => this.db.insert(refreshTokensTable)
                    .values({
                        userId,
                        tokenHash,
                        expiresAt
                    })
                    .returning()
            ));
        return token;
    }

    async getRefreshToken(tokenHash: string): Promise<RefreshToken | undefined> {
        const [token] = await withDbErrors(
            () => this.db.select()
                .from(refreshTokensTable)
                .where(eq(refreshTokensTable.tokenHash, tokenHash))
        );
        return token;
    }

    async deleteRefreshToken(tokenHash: string): Promise<RefreshToken | undefined> {
        const [deleted] = await withDbErrors(
            () => this.db.delete(refreshTokensTable)
                .where(eq(refreshTokensTable.tokenHash, tokenHash))
                .returning()
        );
        return deleted;
    }
}