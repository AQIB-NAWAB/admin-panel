"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const auth_1 = require("../common/utils/auth");
const index_1 = require("../config/index");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async login(data) {
        const userEntity = await this.validateUser(data.email, data.password);
        const user = {
            id: userEntity.id,
            email: userEntity.email,
        };
        const { accessToken, refreshToken } = (0, auth_1.createTokensForUser)(this.jwtService, user);
        await this.userService.updateRefreshToken(userEntity.id, refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user
        };
    }
    async signup(data) {
        const exists = await this.userService.findByEmail(data.email);
        if (exists)
            throw new common_1.BadRequestException('User already exists');
        const userEntity = await this.userService.create(data);
        const user = {
            id: userEntity.id,
            email: userEntity.email,
        };
        const { accessToken, refreshToken } = (0, auth_1.createTokensForUser)(this.jwtService, user);
        await this.userService.updateRefreshToken(userEntity.id, refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user
        };
    }
    async refreshToken(refreshTokenDto) {
        const { refresh_token } = refreshTokenDto;
        try {
            const payload = this.jwtService.verify(refresh_token, {
                secret: index_1.default.JWT_REFRESH_SECRET,
            });
            if (payload.tokenType !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const user = await this.userService.findByRefreshToken(refresh_token);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (user.id !== payload.sub) {
                throw new common_1.UnauthorizedException('Token mismatch');
            }
            const userPayload = {
                id: user.id,
                email: user.email,
            };
            const { accessToken } = (0, auth_1.createTokensForUser)(this.jwtService, userPayload);
            return { access_token: accessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.userService.clearRefreshToken(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map