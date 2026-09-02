"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
const drizzle_orm_1 = require("drizzle-orm");
const __1 = require("..");
const schema_1 = require("../schema");
const db_1 = require("../../utils/db");
async function createUser(email, passwordHash) {
    const user = (0, db_1.expectFirstRow)(await (0, db_1.withDbErrors)(() => __1.db.insert(schema_1.usersTable)
        .values({
            email,
            passwordHash
        }).returning({
            id: schema_1.usersTable.id,
            email: schema_1.usersTable.email
        })));
    return user;
}
async function findUserByEmail(email) {
    const [user] = await (0, db_1.withDbErrors)(() => __1.db.select({
        id: schema_1.usersTable.id,
        email: schema_1.usersTable.email,
        passwordHash: schema_1.usersTable.passwordHash
    })
        .from(schema_1.usersTable)
        .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email)));
    return user;
}
//# sourceMappingURL=users.js.map