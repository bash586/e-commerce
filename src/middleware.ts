import {
    Request as Req,
    Response as Res,
    NextFunction,
} from "express";
import { PostgresError } from "./errors/postgres";
import { HttpError } from "./errors/http";

export async function errorMiddleware(
    err: Error,
    req: Req,
    res: Res,
    next: NextFunction
) {
    if (err instanceof PostgresError) {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    console.error("Unhandled Exception:", err);
    res.status(500).json({ error: "Internal Server Error" });
}