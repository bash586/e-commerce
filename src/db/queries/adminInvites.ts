import { eq } from "drizzle-orm";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";
import { db as globalDb, DbType, TxType } from "../index.js";
import { AdminInvite, adminInvitesTable } from "../schema.js";



export class adminInvitesRepository {
    constructor(private db: DbType = globalDb) { }

    async storeInvite(
        email: string,
        invitedBy: string,
        tokenHash: string,
        expiresAt: Date,
        tx?: TxType
    ): Promise<AdminInvite> {
        const client = tx ?? this.db
        const invite = expectFirstRow(
            await withDbErrors(
                () => client.insert(adminInvitesTable)
                    .values({
                        tokenHash,
                        email,
                        invitedBy,
                        expiresAt,
                    })
                    .returning()
            ));
        return invite;
    }

    async acceptInvite(
        tokenHash: string,
        tx?: TxType
    ): Promise<AdminInvite> {
        const client = tx ?? this.db
        const updated = expectFirstRow(
            await withDbErrors(
                () => client.update(adminInvitesTable)
                    .set({
                        acceptedAt: new Date()
                    })
                    .where(eq(adminInvitesTable.tokenHash, tokenHash))
                    .returning()
            ));
        return updated;
    }
    async findInviteByTokenHash(tokenHash: string): Promise<AdminInvite | undefined> {
        const [invite] = await withDbErrors(
            () => this.db.select()
                .from(adminInvitesTable)
                .where(eq(adminInvitesTable.tokenHash, tokenHash))
        );
        return invite;
    }

}