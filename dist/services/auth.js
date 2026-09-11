import { UnauthorizedError, BadRequestError } from "../errors/http.js";
import { UniqueViolationError } from "../errors/postgres.js";
export class AuthService {
    userRepo;
    password;
    tokenService;
    constructor(userRepo, password, tokenService) {
        this.userRepo = userRepo;
        this.password = password;
        this.tokenService = tokenService;
    }
    async registerUser(email, password) {
        const passwordHash = await this.password.hashPassword(password);
        try {
            const user = await this.userRepo.createUser(email, passwordHash);
            const { accessToken, refreshToken } = await this.tokenService.generateTokenPair(user.id, user.email, user.role);
            return { user, accessToken, refreshToken };
        }
        catch (err) {
            if (err instanceof UniqueViolationError) {
                throw new BadRequestError("Email already in use");
            }
            throw err;
        }
    }
    async loginUser(email, password) {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user)
            throw new UnauthorizedError("Invalid credentials");
        const success = await this.password.verifyPassword(user.passwordHash, password);
        if (!success)
            throw new UnauthorizedError("Invalid credentials");
        const { accessToken, refreshToken } = await this.tokenService.generateTokenPair(user.id, user.email, user.role);
        const publicUser = {
            id: user.id, email: user.email, role: user.role
        };
        return { user: publicUser, accessToken, refreshToken };
    }
}
//# sourceMappingURL=auth.js.map