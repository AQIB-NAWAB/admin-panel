import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  JwtPayload,
  UserResponsePayload,
} from 'src/auth/interfaces/jwt-payload.interface';
export function sendToken(res: Response, token: string) {
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.cookie('access_token', token, cookieOpts);
}

export function clearToken(res: Response) {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  });
}

export function createTokenForUser(
  jwtService: JwtService,
  user: UserResponsePayload,
): string {
  const payload: JwtPayload = { sub: user.id, email: user.email };
  return jwtService.sign(payload);
}
