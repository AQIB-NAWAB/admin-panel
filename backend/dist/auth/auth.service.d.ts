import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponse } from './interfaces/jwt-payload.interface';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<import("../user/user.entity").User>;
    login(data: LoginDto): Promise<TokenResponse>;
    signup(data: SignupDto): Promise<TokenResponse>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<void>;
}
