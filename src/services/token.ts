import jwt from "jsonwebtoken";
import { TokenRepository } from "../db/queries/tokens.js";
import { UserRepository } from "../db/queries/users.js";
import { CryptoService } from "../utils/crypto.js";
import { NotFoundError, UnauthorizedError } from "../errors/http.js";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class TokenService {
    constructor(
        private tokenRepo: TokenRepository,
        private userRepo: UserRepository,
        private crypto: CryptoService,
        private config: {
            jwt: {
                secret: string;
                expiresAtMs: string | number;
                refreshExpiresAtMs: string | number;
            };
        },
        private signJwt: typeof jwt.sign
    ) { }

    createAccessToken(userId: string, email: string, role: string): string {
        const payload = { role, email };
        const options: jwt.SignOptions = {
            algorithm: "HS256",
            expiresIn: Math.floor(Number(this.config.jwt.expiresAtMs) / 1000),
            issuer: "ecommerce-api",
            subject: userId,
        };
        return this.signJwt(payload, this.config.jwt.secret, options);
    }

    async createRefreshToken(userId: string): Promise<string> {
        const rawToken = this.crypto.generateRandomToken();
        const tokenHash = this.crypto.hashToken(rawToken);
        const expiresAt = new Date(
            Date.now() + Number(this.config.jwt.refreshExpiresAtMs)
        );

        await this.tokenRepo.storeRefreshToken(userId, tokenHash, expiresAt);
        return rawToken;
    }

    async removeRefreshToken(token: string, isHashed?: boolean): Promise<void> {
        const tokenHash = isHashed
            ? token
            : this.crypto.hashToken(token);
        await this.tokenRepo.deleteRefreshToken(tokenHash);
    }

    async generateTokenPair(userId: string, email: string, role: string): Promise<TokenPair> {
        const accessToken = this.createAccessToken(userId, email, role);
        const refreshToken = await this.createRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    async refreshAccessToken(oldToken: string): Promise<TokenPair> {
        const tokenHash = this.crypto.hashToken(oldToken);
        const refreshToken = await this.tokenRepo.getRefreshToken(tokenHash);
        if (!refreshToken) throw new UnauthorizedError("Login to proceed");

        await this.tokenRepo.deleteRefreshToken(tokenHash);

        if (refreshToken.expiresAt.getTime() < Date.now()) {
            throw new UnauthorizedError("Login to proceed");
        }

        const user = await this.userRepo.findUserById(refreshToken.userId);
        if (!user) throw new NotFoundError("user can not be found");

        return this.generateTokenPair(user.id, user.email, user.role);
    }
}
