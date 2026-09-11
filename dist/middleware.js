import { PostgresError, TransientDbError } from "./errors/postgres.js";
import { ForbiddenError, HttpError, UnauthorizedError } from "./errors/http.js";
import jwt from "jsonwebtoken";
import { JwtSchema } from "./schemas.js";
import { config } from "./config.js";
export async function errorMiddleware(err, req, res, next) {
    if (err instanceof PostgresError) {
        if (err instanceof TransientDbError) {
            res.setHeader("Retry-After", "10");
            res.status(503).json({ error: "service is down, retry later" });
            return;
        }
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else {
        console.error("Unhandled Exception:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function authenticateMiddleware(req, res, next) {
    const accessToken = req.cookies.access_token;
    if (!accessToken)
        throw new UnauthorizedError("Login required");
    try {
        const decoded = jwt.verify(accessToken, config.jwt.secret, {
            algorithms: ["HS256"],
            issuer: "ecommerce-api",
        });
        const payload = JwtSchema.parse(decoded);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };
        next();
    }
    catch (err) {
        // must refresh
        if (err instanceof jwt.TokenExpiredError)
            throw new UnauthorizedError("expired token");
        // must login
        throw new UnauthorizedError("Invalid token");
    }
}
export function authorizeRoleMiddleware(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError("You are not authorized to perform this action");
        }
        next();
    };
}
export function validateMiddleware(schema) {
    return async (req, res, next) => {
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
    };
}
//# sourceMappingURL=middleware.js.map