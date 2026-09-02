import {
    Request as Req,
    Response as Res,
    NextFunction,
} from "express";
import { PostgresError, TransientDbError } from "./errors/postgres";
import { ForbiddenError, HttpError, UnauthorizedError } from "./errors/http";
import { verify } from "jsonwebtoken";
import { JwtSchema } from "./schemas";
import { config } from "./config";
import { ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";

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
export async function authenticateMiddleware(
    req: Req,
    res: Res,
    next: NextFunction
) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) throw new UnauthorizedError("Login required");

    try {
        const decoded = verify(accessToken, config.jwt.secret, {
            algorithms: ["HS256"],
            issuer: "ecommerce-api",
        });
        const payload = JwtSchema.parse(decoded);
        req.user = {
            id: payload.sub,
            role: payload.role
        };
        next();
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
}

export function authorizeRoleMiddleware(allowedRoles: string[]) {
    return (
        req: Req,
        res: Res,
        next: NextFunction
    ) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError("You are not authorized to perform this action");
        }
        next();
    }
}

import * as z from "zod";

export function validateMiddleware(schema: z.ZodObject) {
    return async (
        req: Req,
        res: Res,
        next: NextFunction
    ) => {
        const result = await schema.safeParseAsync(req.body);
        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            res.status(400).json({
                errors: errors
            });
            return;
        }
        next();
    }
}