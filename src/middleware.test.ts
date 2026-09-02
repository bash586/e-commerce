import { describe, it, expect, vi } from "vitest";
import { validateMiddleware } from "./middleware";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

describe("validateMiddleware", () => {
    it("should call next() if validation succeeds", async () => {
        const schema = z.object({
            name: z.string(),
        });
        const middleware = validateMiddleware(schema as any);
        const req = { body: { name: "test" } } as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
    });
    it("should return 400 with errors if validation fails", async () => {
        const schema = z.object({
            name: z.string(),
        });
        const middleware = validateMiddleware(schema as any);
        const req = { body: { name: 123 } } as unknown as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: [
                {
                    field: "name",
                    message: "Invalid input: expected string, received number",
                },
            ],
        });
        expect(next).not.toHaveBeenCalled();
    });
});
