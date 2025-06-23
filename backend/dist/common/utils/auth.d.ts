import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserResponsePayload } from '../../auth/interfaces/jwt-payload.interface';
export declare function sendToken(res: Response, token: string): void;
export declare function clearToken(res: Response): void;
export declare function createTokenForUser(jwtService: JwtService, user: UserResponsePayload): string;
