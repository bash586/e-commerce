import {
    Request as Req,
    Response as Res,
    NextFunction,
} from "express";
import { PostgresError, TransientDbError } from "./errors/postgres";
import { HttpError } from "./errors/http";

export async function errorMiddleware(
    err: Error,
    req: Req,
    res: Res,
    next: NextFunction
) {
    if (err instanceof PostgresError) {
        if (err instanceof TransientDbError) {
            res.setHeader("Retry-After", "10");
            res.status(503).json({ error: "service is down, retry later" });
            return;
        }
        res.status(400).json({ error: err.message });

    } else if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        console.error("Unhandled Exception:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}