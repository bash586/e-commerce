"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserByEmail = getUserByEmail;
const drizzle_orm_1 = require("drizzle-orm");
const __1 = require("..");
const schema_1 = require("../schema");
async function createUser(email, passwordHash) {
    const [user] = await __1.db.insert(schema_1.usersTable)
        .values({
        email,
        passwordHash
    }).returning({
        id: schema_1.usersTable.id,
        email: schema_1.usersTable.email
    });
    if (!user)
        throw new Error("Failed to create user");
    return user;
}
async function getUserByEmail(email) {
    const [user] = await __1.db.select({
        id: schema_1.usersTable.id,
        email: schema_1.usersTable.email,
        passwordHash: schema_1.usersTable.passwordHash
    })
        .from(schema_1.usersTable)
        .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
    return user;
}
//# sourceMappingURL=users.js.map