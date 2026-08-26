"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.refreshAccessToken = refreshAccessToken;
const node_crypto_1 = require("node:crypto");
const users_1 = require("../db/queries/users");
const argon2_1 = require("argon2");
const postgres_1 = require("../errors/postgres");
const http_1 = require("../errors/http");
const tokens_1 = require("../db/queries/tokens");
const config_1 = require("../config");
const jsonwebtoken_1 = require("jsonwebtoken");
async function registerUser(email, password) {
    const passwordHash = await (0, argon2_1.hash)(password);
    try {
        const user = await (0, users_1.createUser)(email, passwordHash);
        const accessToken = createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        return { user, accessToken, refreshToken };
    }
    catch (err) {
        console.log("logged ERROR: ", err?.cause?.code);
        const dbError = (0, postgres_1.mapDbError)(err);
        if (dbError instanceof postgres_1.UniqueViolationError) {
            dbError.message = "Email already in use";
        }
        throw dbError || err;
    }
}
async function loginUser(email, password) {
    const user = await (0, users_1.getUserByEmail)(email);
    if (!user)
        throw new http_1.NotFoundError("Invalid credentials");
    const success = await (0, argon2_1.verify)(user.passwordHash, password);
    if (!success)
        throw new http_1.UnauthorizedError("Invalid credentials");
    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
}
async function logoutUser(userId, tokenHash) {
    const tokenObj = await (0, tokens_1.findRefreshToken)(tokenHash);
    if (!tokenObj)
        throw new http_1.NotFoundError("token can not be found");
    if (tokenObj.userId !== userId)
        throw new http_1.ForbiddenError("the token is not yours to revoke");
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
    const rawToken = (0, node_crypto_1.randomBytes)(32).toString("base64url");
    const tokenHash = (0, node_crypto_1.createHash)("sha256")
        .update(rawToken)
        .digest("hex");
    const expiresAt = new Date(Date.now() + Number(config_1.config.jwt.refreshExpiresAtMs));
    await (0, tokens_1.storeRefreshToken)(userId, tokenHash, expiresAt);
    return rawToken;
}
function refreshAccessToken(oldToken) {
}
//# sourceMappingURL=auth.js.map