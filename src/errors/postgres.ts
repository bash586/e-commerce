export const PG_CODES = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
} as const;

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

export function mapDbError(err: any): PostgresError | undefined {
    if (!(typeof err?.cause?.code === "string")) return;
    switch (err?.cause?.code) {
        case PG_CODES.UNIQUE_VIOLATION:
            return new UniqueViolationError(err.message);
        case PG_CODES.FOREIGN_KEY_VIOLATION:
            return new ForeignKeyViolationError(err.message);
        default:
            return;
    }
}