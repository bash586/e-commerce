import { Pool } from "pg";
import { config } from "../config.js";
import { drizzle } from "drizzle-orm/node-postgres";
export const pool = new Pool({
    connectionString: config.db.url,
    max: 10,
});
export const db = drizzle({ client: pool });
//# sourceMappingURL=index.js.map