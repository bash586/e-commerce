import { isTransient, mapDbError } from "../errors/postgres";

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

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await queryFn();
        } catch (err: unknown) {
            const mapped = mapDbError(err);
            if (!isTransient(mapped)) {
                throw mapped || err;
            }
            // backoff
            const delay = Math.min(
                maxDelay, baseDelay * 2 ** (baseDelay + attempt - 1)
            );
            if (attempt < maxRetries) await sleep(delay);
        }
    }
    throw new Error("query failed after max retries");
}

function sleep(ms: number) {
    return new Promise(
        (resolve) => setTimeout(resolve, ms)
    );
}
/**
 * @throws error when query does not return value 
 */
export function expectFirstRow<T>(
    result: Array<T> | undefined
): T {
    if (!Array.isArray(result) || result.length === 0) throw new Error("service unavailable");
    return result[0] as T;
}