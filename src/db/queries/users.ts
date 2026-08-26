import { eq } from "drizzle-orm";
import { db } from "..";
import { PublicUser, User, usersTable } from "../schema";
import { expectFirstRow, withDbErrors } from "../../utils/db";

export async function createUser(
    email: string,
    passwordHash: string
): Promise<PublicUser> {
    const user = expectFirstRow(
        await withDbErrors(
            () => db.insert(usersTable)
                .values({
                    email,
                    passwordHash
                }).returning({
                    id: usersTable.id,
                    email: usersTable.email
                })
        ));
    return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await withDbErrors(
        () => db.select({
            id: usersTable.id,
            email: usersTable.email,
            passwordHash: usersTable.passwordHash
        })
            .from(usersTable)
            .where(eq(usersTable.email, email))
    );
    return user;
}