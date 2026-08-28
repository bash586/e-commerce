export const PG_CODES = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
} as const;

const TRANSIENT_CODES = new Set([
    "08000", // connection_exception
    "08003", // connection_does_not_exist
    "08006", // connection_failure
    "40001", // serialization_failure
    "40P01", // deadlock_detected
    "57014", // query_cancelled (statement timeout)
]);

export class PostgresError extends Error {
    code: string;
    constructor(message: string, code: string) {
        super(message);
        this.name = "PostgresError";
        this.code = code;
    }
}

export class UniqueViolationError extends PostgresError {
    constructor(message = "Unique constraint violation") {
        super(message, PG_CODES.UNIQUE_VIOLATION);
        this.name = "UniqueViolationError";
    }
}

export class ForeignKeyViolationError extends PostgresError {
    constructor(message = "Foreign key constraint violation") {
        super(message, PG_CODES.FOREIGN_KEY_VIOLATION);
        this.name = "ForeignKeyViolationError";
    }
}

export class TransientDbError extends PostgresError {
    constructor(message = "Database temporarily unavailable", errCode: string) {
        super(message, errCode);
        this.name = "TransientError";
    }
}

export function isTransient(err: any): boolean {
    const code = err?.cause?.code ?? err?.code;
    if (typeof code === "string" && TRANSIENT_CODES.has(code)) return true;

    const msg = String(err?.cause?.message ?? err?.message ?? "");
    return /ECONNREFUSED|ECONNRESET/.test(msg);
}


export function mapDbError(err: any): PostgresError | undefined {
    if (isTransient(err)) {
        return new TransientDbError(err.message, err?.cause?.code ?? "TRANSIENT");
    }
    const code = err?.cause?.code ?? err?.code;
    if (!(typeof code === "string")) return;
    switch (code) {
        case PG_CODES.UNIQUE_VIOLATION:
            return new UniqueViolationError(err.message);
        case PG_CODES.FOREIGN_KEY_VIOLATION:
            return new ForeignKeyViolationError(err.message);
        default:
            return;
    }
}