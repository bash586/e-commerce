import { Pool } from "pg";
import { config } from "../config.js";
import { drizzle } from "drizzle-orm/node-postgres";

export const pool: Pool = new Pool({
    connectionString: config.db.url,
    max: 10,
});

export const db = drizzle({ client: pool });
export type DbType = typeof db;
export type TxType = Parameters<Parameters<typeof db.transaction>[0]>[0];