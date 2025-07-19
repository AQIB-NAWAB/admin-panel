"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokens = sendTokens;
exports.sendToken = sendToken;
exports.clearTokens = clearTokens;
exports.clearToken = clearToken;
exports.createTokenForUser = createTokenForUser;
exports.createRefreshTokenForUser = createRefreshTokenForUser;
exports.createTokensForUser = createTokensForUser;
const index_1 = require("../../config/index");
function sendTokens(res, accessToken, refreshToken) {
    const cookieOpts = {
        httpOnly: true,
        secure: index_1.default.ENV === 'production',
        sameSite: 'lax',
    };
    res.cookie('access_token', accessToken, {
        ...cookieOpts,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
        ...cookieOpts,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
function sendToken(res, token) {
    const cookieOpts = {
        httpOnly: true,
        secure: index_1.default.ENV === 'production',
        sameSite: 'lax',
        maxAge: Number(index_1.default.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000,
    };
    res.cookie('access_token', token, cookieOpts);
}
function clearTokens(res) {
    const cookieOpts = {
        httpOnly: true,
        secure: index_1.default.ENV === 'production',
        sameSite: 'lax',
    };
    res.clearCookie('access_token', cookieOpts);
    res.clearCookie('refresh_token', cookieOpts);
}
function clearToken(res) {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: index_1.default.ENV === 'production',
        sameSite: 'lax',
    });
}
function createTokenForUser(jwtService, user) {
    const payload = {
        sub: user.id,
        email: user.email,
    };
    return jwtService.sign(payload, {
        secret: index_1.default.JWT_SECRET,
        expiresIn: index_1.default.JWT_EXPIRATION_TIME,
    });
}
function createRefreshTokenForUser(jwtService, user) {
    const payload = {
        sub: user.id,
        email: user.email,
        tokenType: 'refresh',
    };
    return jwtService.sign(payload, {
        secret: index_1.default.JWT_REFRESH_SECRET,
        expiresIn: index_1.default.JWT_REFRESH_EXPIRATION_TIME,
    });
}
function createTokensForUser(jwtService, user) {
    const accessToken = createTokenForUser(jwtService, user);
    const refreshToken = createRefreshTokenForUser(jwtService, user);
    return { accessToken, refreshToken };
}
//# sourceMappingURL=auth.js.map