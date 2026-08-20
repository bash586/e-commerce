import { db } from "..";
import { PublicUser, usersTable } from "../schema";

export async function createUser(
    email: string,
    passwordHash: string
): Promise<PublicUser> {
    const [user] = await db.insert(usersTable)
        .values({
            email,
            passwordHash
        }).returning({
            id: usersTable.id,
            email: usersTable.email
        });
    if (!user) throw new Error("Failed to create user");
    return user;
}