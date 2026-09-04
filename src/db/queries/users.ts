import { eq } from "drizzle-orm";
import { db as globalDb, DbType, TxType } from "../index.js";
import { PublicUser, User, usersTable } from "../schema.js";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";
import { email } from "zod";


export class UserRepository {
    constructor(private db: DbType = globalDb) { }

    async createUser(
        email: string,
        passwordHash: string
    ): Promise<PublicUser> {
        const user = expectFirstRow(
            await withDbErrors(
                () => this.db.insert(usersTable)
                    .values({
                        email,
                        passwordHash
                    }).returning({
                        id: usersTable.id,
                        email: usersTable.email,
                        role: usersTable.role
                    })
            ));
        return user;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        const [user] = await withDbErrors(
            () => this.db.select({
                id: usersTable.id,
                email: usersTable.email,
                passwordHash: usersTable.passwordHash,
                role: usersTable.role
            })
                .from(usersTable)
                .where(eq(usersTable.email, email))
        );
        return user;
    }

    async findUserById(userId: string): Promise<User | undefined> {
        const [user] = await withDbErrors(
            () => this.db.select({
                id: usersTable.id,
                email: usersTable.email,
                passwordHash: usersTable.passwordHash,
                role: usersTable.role
            })
                .from(usersTable)
                .where(eq(usersTable.id, userId))
        );
        return user;
    }
    async updateRoleToAdmin(email: string, tx?: TxType): Promise<PublicUser> {
        const client = tx ?? this.db;
        const user: PublicUser = expectFirstRow(
            await withDbErrors(
                () => client.update(usersTable)
                    .set({ role: "admin" })
                    .where(eq(usersTable.email, email))
                    .returning({
                        id: usersTable.id,
                        email: usersTable.email,
                        role: usersTable.role
                    })
            ));
        return user;
    }
}