import { config } from "../../config";
import { drizzle } from "drizzle-orm/node-postgres";

export const client = drizzle(config.db.url);

