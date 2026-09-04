import { mapDbError, TransientDbError } from "../errors/postgres.js";

export async function withDbErrors<T>(
    queryFn: () => Promise<T>,
    options?: {
        maxRetries?: number,
        baseDelay?: number,
        maxDelay?: number
    }
): Promise<T> {
    const {
        maxRetries = 3,
        baseDelay = 200,
        maxDelay = 3000
    } = options || {};

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await queryFn();
        } catch (err: unknown) {
            const mapped = mapDbError(err);
            if (!(mapped instanceof TransientDbError)) {
                throw mapped || err;
            }
            // backoff
            if (attempt < maxRetries) {
                const delay = Math.min(
                    maxDelay, baseDelay * 2 ** attempt
                );
                console.warn(
                    `[withDbErrors] Transient error (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms:`,
                    (mapped as Error).message
                );
                await sleep(delay);
            }
        }
    }
    throw new TransientDbError("query failed after max retries", "TRANSIENT");
}

function sleep(ms: number) {
    return new Promise(
        (resolve) => setTimeout(resolve, ms)
    );
}
/**
 * @throws error when insert and delete queries are not successful
 */
export function expectFirstRow<T>(
    result: Array<T> | undefined
): T {
    if (!Array.isArray(result) || result.length === 0) throw new Error("unsuccessful operation, retry later...");
    return result[0] as T;
}