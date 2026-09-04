import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { createTestUser, extractCookies } from "../helpers.js";
import { config } from "../../config.js";

describe("POST /api/v1/auth/register", () => {
    it("should refresh", async () => {
        const registerResponse = await createTestUser("testuser@gmail.com", "123123123");
        const res = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", registerResponse.authCookies);
        // Status
        expect(res.status).toBe(200);
        // Body shape
        expect(res.body).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        });
    });
    it("should not refresh when token is expired", async () => {
        vi.useFakeTimers({ toFake: ["Date"] });

        const registerResponse = await createTestUser("expired@gmail.com", "123123123");

        vi.setSystemTime(new Date(Date.now() + Number(config.jwt.refreshExpiresAtMs) + 1));

        const res = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", registerResponse.authCookies);

        // Status
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({
            error: "Login to proceed"
        });
        vi.useRealTimers();
    });
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
        const cookies: string[] = extractCookies(res);
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
