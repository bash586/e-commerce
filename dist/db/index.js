"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const config_1 = require("../config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
exports.db = (0, node_postgres_1.drizzle)(config_1.config.db.url);
//# sourceMappingURL=index.js.map