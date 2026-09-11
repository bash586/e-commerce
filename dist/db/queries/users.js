import { eq } from "drizzle-orm";
import { db as globalDb } from "../index.js";
import { usersTable } from "../schema.js";
import { expectFirstRow, withDbErrors } from "../../utils/db.js";
export class UserRepository {
    db;
    constructor(db = globalDb) {
        this.db = db;
    }
    async createUser(email, passwordHash) {
        const user = expectFirstRow(await withDbErrors(() => this.db.insert(usersTable)
            .values({
            email,
            passwordHash
        }).returning({
            id: usersTable.id,
            email: usersTable.email,
            role: usersTable.role
        })));
        return user;
    }
    async findUserByEmail(email) {
        const [user] = await withDbErrors(() => this.db.select({
            id: usersTable.id,
            email: usersTable.email,
            passwordHash: usersTable.passwordHash,
            role: usersTable.role
        })
            .from(usersTable)
            .where(eq(usersTable.email, email)));
        return user;
    }
    async findUserById(userId) {
        const [user] = await withDbErrors(() => this.db.select({
            id: usersTable.id,
            email: usersTable.email,
            passwordHash: usersTable.passwordHash,
            role: usersTable.role
        })
            .from(usersTable)
            .where(eq(usersTable.id, userId)));
        return user;
    }
    async updateRoleToAdmin(email, tx) {
        const client = tx ?? this.db;
        const user = expectFirstRow(await withDbErrors(() => client.update(usersTable)
            .set({ role: "admin" })
            .where(eq(usersTable.email, email))
            .returning({
            id: usersTable.id,
            email: usersTable.email,
            role: usersTable.role
        })));
        return user;
    }
}
//# sourceMappingURL=users.js.map