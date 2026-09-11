#!/root/.nvm/versions/node/v21.7.0/bin/node
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "../src/db/schema.js";
import { PasswordService } from "../src/utils/passwords.js";
import { Pool } from "pg";
import { config } from "../src/config.js";
function printUsageAndExit() {
    console.error("Usage: npm run addadmin [email] [password]");
    process.exit(1);
}
const processArgs = process.argv;
// In Node, process.argv[2] is the first argument after the script name
const email = processArgs[2];
const password = processArgs[3];
if (!email || !password || email.startsWith("--") || password.startsWith("--")) {
    printUsageAndExit();
}
if (!email.includes("@")) {
    console.error("Error: Invalid email format.");
    process.exit(1);
}
if (password.length < 6) {
    console.error("Error: Password must be at least 6 characters long.");
    process.exit(1);
}
const passwordHash = await (new PasswordService()).hashPassword(password);
const pool = new Pool({
    connectionString: config.db.url,
});
const db = drizzle({ client: pool });
try {
    const [user] = await db.insert(usersTable)
        .values({
        email,
        passwordHash,
        role: "admin"
    }).returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role
    });
    console.log(".......... New Admin Created ..........");
    console.log(user);
}
catch (error) {
    if (error.code === '23505') {
        console.error(`Error: A user with email '${email}' already exists.`);
    }
    else {
        console.error("Error creating admin:", error.message || error);
    }
}
finally {
    await pool.end();
}
//# sourceMappingURL=create-admin.js.map