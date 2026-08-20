import { createUser } from "../db/queries/users";
import { PublicUser } from "../db/schema";
import { hash } from "argon2";
import { mapDbError, UniqueViolationError } from "../errors/postgres";

export async function registerUser(
    email: string,
    password: string
): Promise<PublicUser> {
    const passwordHash = await hash(password);
    try {
        return await createUser(email, passwordHash);
    } catch (err: unknown) {
        const dbError = mapDbError(err);

        if (dbError instanceof UniqueViolationError) {
            dbError.message = "Email already in use";
        }

        throw dbError || err;
    }
}