import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("POST /api/v1/auth/register", () => {
    it("valid data → 201, returns user + sets cookies", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Test User",
                email: "testuser@example.com",
                password: "securepassword123",
                confirmationPassword: "securepassword123",
            });

        // Status
        expect(res.status).toBe(201);

        // Body shape
        expect(res.body).toMatchObject({
            user: {
                id: expect.any(String),
                email: "testuser@example.com",
                role: "customer",
            },
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        });

        // Body must NOT expose passwordHash
        expect(res.body.user.passwordHash).toBeUndefined();

        // Cookies
        const cookies: string[] = res.headers["set-cookie"] ?? [];
        const cookieNames = cookies.map((c) => c.split("=")[0]);
        expect(cookieNames).toContain("access_token");
        expect(cookieNames).toContain("refresh_token");

        // Cookies must be httpOnly
        const accessCookie = cookies.find((c) => c.startsWith("access_token"));
        const refreshCookie = cookies.find((c) => c.startsWith("refresh_token"));
        expect(accessCookie).toMatch(/HttpOnly/i);
        expect(refreshCookie).toMatch(/HttpOnly/i);
    });
});
