"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransientDbError = exports.ForeignKeyViolationError = exports.UniqueViolationError = exports.PostgresError = exports.PG_CODES = void 0;
exports.isTransient = isTransient;
exports.mapDbError = mapDbError;
exports.PG_CODES = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
};
const TRANSIENT_CODES = new Set([
    "08000", // connection_exception
    "08003", // connection_does_not_exist
    "08006", // connection_failure
    "40001", // serialization_failure
    "40P01", // deadlock_detected
    "57014", // query_cancelled (statement timeout)
]);
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
class TransientDbError extends PostgresError {
    constructor(message = "Database temporarily unavailable", errCode) {
        super(message, errCode);
        this.name = "TransientError";
    }
}
exports.TransientDbError = TransientDbError;
function isTransient(err) {
    const code = err?.cause?.code ?? err?.code;
    if (typeof code === "string" && TRANSIENT_CODES.has(code))
        return true;
    const msg = String(err?.cause?.message ?? err?.message ?? "");
    return /ECONNREFUSED|ECONNRESET/.test(msg);
}
function mapDbError(err) {
    if (isTransient(err)) {
        return new TransientDbError(err.message, err?.cause?.code ?? "TRANSIENT");
    }
    const code = err?.cause?.code ?? err?.code;
    if (!(typeof code === "string"))
        return;
    switch (code) {
        case exports.PG_CODES.UNIQUE_VIOLATION:
            return new UniqueViolationError(err.message);
        case exports.PG_CODES.FOREIGN_KEY_VIOLATION:
            return new ForeignKeyViolationError(err.message);
        default:
            return;
    }
}
//# sourceMappingURL=postgres.js.map