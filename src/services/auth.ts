import { UserRepository } from "../db/queries/users.js";
import { PublicUser } from "../db/schema.js";
import { UnauthorizedError, BadRequestError } from "../errors/http.js";
import { PasswordService } from "../utils/passwords.js";
import { UniqueViolationError } from "../errors/postgres.js";
import { TokenService } from "./token.js";

export interface AuthResponse {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
}

export interface AuthDependencies {
    userRepo: UserRepository;
    password: PasswordService;
    tokenService: TokenService;
}

export class AuthService {
    constructor(private deps: AuthDependencies) { }

    async registerUser(email: string, password: string): Promise<AuthResponse> {
        const passwordHash = await this.deps.password.hashPassword(password);
        try {
            const user = await this.deps.userRepo.createUser(email, passwordHash);
            const { accessToken, refreshToken } = await this.deps.tokenService.generateTokenPair(user.id, user.role);
            return { user, accessToken, refreshToken };
        } catch (err: unknown) {
            if (err instanceof UniqueViolationError) {
                throw new BadRequestError("Email already in use");
            }
            throw err;
        }
    }

    async loginUser(email: string, password: string): Promise<AuthResponse> {
        const user = await this.deps.userRepo.findUserByEmail(email);
        if (!user) throw new UnauthorizedError("Invalid credentials");

        const success = await this.deps.password.verifyPassword(user.passwordHash, password);
        if (!success) throw new UnauthorizedError("Invalid credentials");

        const { accessToken, refreshToken } = await this.deps.tokenService.generateTokenPair(user.id, user.role);
        const publicUser = {
            id: user.id, email: user.email, role: user.role
        };
        return { user: publicUser, accessToken, refreshToken };
    }
}
