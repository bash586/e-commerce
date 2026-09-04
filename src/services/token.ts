import jwt from "jsonwebtoken";
import { TokenRepository } from "../db/queries/tokens.js";
import { UserRepository } from "../db/queries/users.js";
import { CryptoService } from "../utils/crypto.js";
import { NotFoundError, UnauthorizedError } from "../errors/http.js";

export interface TokenDependencies {
    tokenRepo: TokenRepository;
    userRepo: UserRepository;
    crypto: CryptoService;
    config: {
        jwt: {
            secret: string;
            expiresAtMs: string | number;
            refreshExpiresAtMs: string | number;
        };
    };
    signJwt: typeof jwt.sign;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class TokenService {
    constructor(private deps: TokenDependencies) { }

    createAccessToken(userId: string, role: string): string {
        const payload = { role };
        const options: jwt.SignOptions = {
            algorithm: "HS256",
            expiresIn: Math.floor(Number(this.deps.config.jwt.expiresAtMs) / 1000),
            issuer: "ecommerce-api",
            subject: userId,
        };
        return this.deps.signJwt(payload, this.deps.config.jwt.secret, options);
    }

    async createRefreshToken(userId: string): Promise<string> {
        const rawToken = this.deps.crypto.generateRandomToken();
        const tokenHash = this.deps.crypto.hashToken(rawToken);
        const expiresAt = new Date(
            Date.now() + Number(this.deps.config.jwt.refreshExpiresAtMs)
        );

        await this.deps.tokenRepo.storeRefreshToken(userId, tokenHash, expiresAt);
        return rawToken;
    }

    async removeRefreshToken(token: string, isHashed?: boolean): Promise<void> {
        const tokenHash = isHashed
            ? token
            : this.deps.crypto.hashToken(token);
        await this.deps.tokenRepo.deleteRefreshToken(tokenHash);
    }

    async generateTokenPair(userId: string, role: string): Promise<TokenPair> {
        const accessToken = this.createAccessToken(userId, role);
        const refreshToken = await this.createRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    async refreshAccessToken(oldToken: string): Promise<TokenPair> {
        const tokenHash = this.deps.crypto.hashToken(oldToken);
        const refreshToken = await this.deps.tokenRepo.getRefreshToken(tokenHash);
        if (!refreshToken) throw new UnauthorizedError("Login to proceed");

        await this.deps.tokenRepo.deleteRefreshToken(tokenHash);

        if (refreshToken.expiresAt.getTime() < Date.now()) {
            throw new UnauthorizedError("Login to proceed");
        }

        const user = await this.deps.userRepo.findUserById(refreshToken.userId);
        if (!user) throw new NotFoundError("user can not be found");

        return this.generateTokenPair(user.id, user.role);
    }
}
