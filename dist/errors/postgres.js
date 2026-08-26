"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignKeyViolationError = exports.UniqueViolationError = exports.PostgresError = exports.PG_CODES = void 0;
exports.mapDbError = mapDbError;
exports.PG_CODES = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
};
class PostgresError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "PostgresError";
        this.code = code;
    }
}
exports.PostgresError = PostgresError;
class UniqueViolationError extends PostgresError {
    constructor(message = "Unique constraint violation") {
        super(message, exports.PG_CODES.UNIQUE_VIOLATION);
        this.name = "UniqueViolationError";
    }
}
exports.UniqueViolationError = UniqueViolationError;
class ForeignKeyViolationError extends PostgresError {
    constructor(message = "Foreign key constraint violation") {
        super(message, exports.PG_CODES.FOREIGN_KEY_VIOLATION);
        this.name = "ForeignKeyViolationError";
    }
}
exports.ForeignKeyViolationError = ForeignKeyViolationError;
function mapDbError(err) {
    if (!(typeof err?.cause?.code === "string"))
        return;
    switch (err?.cause?.code) {
        case exports.PG_CODES.UNIQUE_VIOLATION:
            return new UniqueViolationError(err.message);
        case exports.PG_CODES.FOREIGN_KEY_VIOLATION:
            return new ForeignKeyViolationError(err.message);
        default:
            return;
    }
}
//# sourceMappingURL=postgres.js.map