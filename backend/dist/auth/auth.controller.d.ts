import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserResponsePayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto, res: Response): Promise<{
        user: UserResponsePayload;
    }>;
    login(data: LoginDto, res: Response): Promise<{
        user: UserResponsePayload;
    }>;
    getProfile(user: UserResponsePayload): UserResponsePayload;
    logout(res: Response): {
        message: string;
    };
}
