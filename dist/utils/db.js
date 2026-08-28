"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDbErrors = withDbErrors;
exports.expectFirstRow = expectFirstRow;
const postgres_1 = require("../errors/postgres");
async function withDbErrors(queryFn, options) {
    const { maxRetries = 3, baseDelay = 200, maxDelay = 3000 } = options || {};
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await queryFn();
        }
        catch (err) {
            const mapped = (0, postgres_1.mapDbError)(err);
            if (!(mapped instanceof postgres_1.TransientDbError)) {
                throw mapped || err;
            }
            // backoff
            if (attempt < maxRetries) {
                const delay = Math.min(maxDelay, baseDelay * 2 ** attempt);
                console.warn(`[withDbErrors] Transient error (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms:`, mapped.message);
                await sleep(delay);
            }
        }
    }
    throw new postgres_1.TransientDbError("query failed after max retries", "TRANSIENT");
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @throws error when insert and delete queries are not successful
 */
function expectFirstRow(result) {
    if (!Array.isArray(result) || result.length === 0)
        throw new Error("unsuccessful operation, retry later...");
    return result[0];
}
//# sourceMappingURL=db.js.map