import { beforeAll, beforeEach, vi } from "vitest";
import { db } from "../db";
import { sql } from "drizzle-orm";

beforeAll(async () => {
});

beforeEach(async () => {
    await db.execute(sql`TRUNCATE users, orders, refresh_tokens CASCADE`);
});