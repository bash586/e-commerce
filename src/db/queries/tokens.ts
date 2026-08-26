import { eq } from "drizzle-orm";
import { db } from "../index"
import { RefreshToken, refreshTokensTable } from "../schema"
import { expectFirstRow, withDbErrors } from "../../utils/db";

export async function storeRefreshToken(
    userId: string, tokenHash: string, expiresAt: Date
): Promise<RefreshToken> {
    const token = expectFirstRow(
        await withDbErrors(
            () => db.insert(refreshTokensTable)
                .values({
                    userId,
                    tokenHash,
                    expiresAt
                })
                .returning()
        ));
    return token;
}

export async function getRefreshToken(tokenHash: string): Promise<RefreshToken | undefined> {
    const [token] = await withDbErrors(
        () => db.select()
            .from(refreshTokensTable)
            .where(eq(refreshTokensTable.tokenHash, tokenHash))
    );
    return token;
}

export async function deleteRefreshToken(tokenHash: string): Promise<RefreshToken | undefined> {
    const [deleted] = await withDbErrors(
        () => db.delete(refreshTokensTable)
            .where(eq(refreshTokensTable.tokenHash, tokenHash))
            .returning()
    );
    return deleted;
}