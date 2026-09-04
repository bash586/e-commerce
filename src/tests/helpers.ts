import request, { type Response } from "supertest";
import app from "../app.js";
import { AuthResponse } from "../services/auth.js";
type TestAuthResponse = AuthResponse & { authCookies: string[] }

export async function createTestUser(email: string, password: string): Promise<TestAuthResponse> {
    const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
            name: "Test User",
            email,
            password,
            confirmationPassword: password,
        });

    return { ...res.body, authCookies: extractCookies(res) };
}

export function extractCookies(res: Response): string[] {
    const cookies: string[] = (res.headers["set-cookie"] as unknown as string[]) ?? [];
    return cookies;
}