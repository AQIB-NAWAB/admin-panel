import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  JwtPayload,
  UserResponsePayload,
} from '../../auth/interfaces/jwt-payload.interface';
import CONFIG from '../../config/index';
export function sendToken(res: Response, token: string) {
  const cookieOpts = {
    httpOnly: true,
    secure: CONFIG.ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: Number(CONFIG.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000,
  };
  res.cookie('access_token', token, cookieOpts);
}

export function clearToken(res: Response) {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: CONFIG.ENV === 'production',
    sameSite: 'lax' as const,
  });
}

export function createTokenForUser(
  jwtService: JwtService,
  user: UserResponsePayload,
): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
  };
  return jwtService.sign(payload, {
    secret: CONFIG.JWT_SECRET,
    expiresIn: CONFIG.JWT_EXPIRATION_TIME,
  });
}
