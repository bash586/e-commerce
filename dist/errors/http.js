export class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}
export class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
export class NotFoundError extends HttpError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
//# sourceMappingURL=http.js.map