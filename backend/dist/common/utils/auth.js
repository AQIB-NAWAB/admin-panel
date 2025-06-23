"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = sendToken;
exports.clearToken = clearToken;
exports.createTokenForUser = createTokenForUser;
const index_1 = require("../../config/index");
function sendToken(res, token) {
    const cookieOpts = {
        httpOnly: true,
        secure: index_1.default.ENV === 'production',
        sameSite: 'lax',
        maxAge: Number(index_1.default.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000,
    };
    res.cookie('access_token', token, cookieOpts);
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
//# sourceMappingURL=auth.js.map