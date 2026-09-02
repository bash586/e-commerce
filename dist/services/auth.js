"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.refreshAccessToken = refreshAccessToken;
const users_1 = require("../db/queries/users");
const http_1 = require("../errors/http");
const tokens_1 = require("../db/queries/tokens");
const config_1 = require("../config");
const jsonwebtoken_1 = require("jsonwebtoken");
const passwords_1 = require("../utils/passwords");
const crypto_1 = require("../utils/crypto");
const postgres_1 = require("../errors/postgres");
async function registerUser(email, password) {
    const passwordHash = await (0, passwords_1.hashPassword)(password);
    try {
        const user = await (0, users_1.createUser)(email, passwordHash);
        const accessToken = createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        return { user, accessToken, refreshToken };
    }
    catch (err) {
        if (err instanceof postgres_1.UniqueViolationError) {
            throw new http_1.BadRequestError("Email already in use");
        }
        throw err;
    }
}
async function loginUser(email, password) {
    const user = await (0, users_1.findUserByEmail)(email);
    if (!user)
        throw new http_1.UnauthorizedError("Invalid credentials");
    const success = await (0, passwords_1.verifyPassword)(user.passwordHash, password);
    if (!success)
        throw new http_1.UnauthorizedError("Invalid credentials");
    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
}
async function logoutUser(userId, rawRefreshToken) {
    const tokenHash = (0, crypto_1.hashToken)(rawRefreshToken);
    await (0, tokens_1.deleteRefreshToken)(tokenHash);
}
function createAccessToken(userId) {
    const payload = {
        "role": "user"
    };
    const options = {
        algorithm: 'HS256',
        expiresIn: Math.floor(Number(config_1.config.jwt.expiresAtMs) / 1000),
        issuer: "ecommerce-api",
        subject: userId
    };
    return (0, jsonwebtoken_1.sign)(payload, config_1.config.jwt.secret, options);
}
async function createRefreshToken(userId) {
    const rawToken = (0, crypto_1.generateRandomToken)();
    const tokenHash = (0, crypto_1.hashToken)(rawToken);
    const expiresAt = new Date(Date.now() + Number(config_1.config.jwt.refreshExpiresAtMs));
    await (0, tokens_1.storeRefreshToken)(userId, tokenHash, expiresAt);
    return rawToken;
}
;
async function refreshAccessToken(oldToken) {
    const tokenHash = (0, crypto_1.hashToken)(oldToken);
    const refreshToken = await (0, tokens_1.getRefreshToken)(tokenHash);
    if (!refreshToken)
        throw new http_1.UnauthorizedError("Login to proceed");
    await (0, tokens_1.deleteRefreshToken)(tokenHash);
    if (refreshToken.expiresAt.getTime() < Date.now())
        throw new http_1.UnauthorizedError("Login to proceed");
    const userId = refreshToken.userId;
    const rawRefreshToken = await createRefreshToken(userId);
    const accessToken = createAccessToken(userId);
    return {
        accessToken: accessToken,
        refreshToken: rawRefreshToken
    };
}
//# sourceMappingURL=auth.js.map