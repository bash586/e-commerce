import { createUser, getUserByEmail } from "../db/queries/users";
import { PublicUser } from "../db/schema";
import { ForbiddenError, NotFoundError, UnauthorizedError, BadRequestError } from "../errors/http";
import { deleteRefreshToken, getRefreshToken, storeRefreshToken } from "../db/queries/tokens";
import { config } from "../config";
import { sign, type SignOptions } from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/passwords";
import { generateRandomToken, hashToken } from "../utils/crypto";
import { UniqueViolationError } from "../errors/postgres";
export interface AuthResponse {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
}

export async function registerUser(
    email: string,
    password: string
): Promise<AuthResponse> {
    const passwordHash = await hashPassword(password);
    try {
        const user = await createUser(email, passwordHash);
        const accessToken = createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        return { user, accessToken, refreshToken };

    } catch (err: unknown) {
        if (err instanceof UniqueViolationError) {
            throw new BadRequestError("Email already in use");
        }
        throw err;
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<AuthResponse> {

    const user = await getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const success = await verifyPassword(user.passwordHash, password);
    if (!success) throw new UnauthorizedError("Invalid credentials");

    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
}

export async function logoutUser(userId: string, rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    await deleteRefreshToken(tokenHash);
}

export function createAccessToken(userId: string): string {
    const payload = {
        "role": "user"
    };

    const options: SignOptions = {
        algorithm: 'HS256' as const,
        expiresIn: Math.floor(Number(config.jwt.expiresAtMs) / 1000),
        issuer: "ecommerce-api",
        subject: userId
    }

    return sign(payload, config.jwt.secret, options);
}

export async function createRefreshToken(userId: string): Promise<string> {
    const rawToken = generateRandomToken();
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + Number(config.jwt.refreshExpiresAtMs));

    await storeRefreshToken(userId, tokenHash, expiresAt);
    return rawToken;
}
interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
};

export async function refreshAccessToken(oldToken: string): Promise<RefreshResponse> {
    const tokenHash = hashToken(oldToken);
    const refreshToken = await getRefreshToken(tokenHash);
    if (!refreshToken) throw new UnauthorizedError("Login to proceed");

    await deleteRefreshToken(tokenHash);

    if (refreshToken.expiresAt.getTime() < Date.now()) throw new UnauthorizedError("Login to proceed");

    const userId = refreshToken.userId;

    const rawRefreshToken = await createRefreshToken(userId);
    const accessToken = createAccessToken(userId);
    return {
        accessToken: accessToken,
        refreshToken: rawRefreshToken
    };
}