import { describe, it, expect } from "vitest";
import { db } from "../db";
import { sql } from "drizzle-orm";

describe("Database Connection", () => {
    it("should be able to execute a simple query", async () => {
        const result = await db.execute(sql`SELECT 1 as result`);
        expect(result).toBeDefined();
        expect(result.rows).toBeDefined();
    });
});
