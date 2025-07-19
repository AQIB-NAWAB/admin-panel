import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  JwtPayload,
  JwtRefreshPayload,
  UserResponsePayload,
} from '../../auth/interfaces/jwt-payload.interface';
import CONFIG from '../../config/index';

export function sendTokens(res: Response, accessToken: string, refreshToken: string) {
  const cookieOpts = {
    httpOnly: true,
    secure: CONFIG.ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.cookie('access_token', accessToken, {
    ...cookieOpts,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOpts,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function sendToken(res: Response, token: string) {
  const cookieOpts = {
    httpOnly: true,
    secure: CONFIG.ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: Number(CONFIG.COOKIE_EXPIRATION_TIME) * 24 * 60 * 60 * 1000,
  };
  res.cookie('access_token', token, cookieOpts);
}

export function clearTokens(res: Response) {
  const cookieOpts = {
    httpOnly: true,
    secure: CONFIG.ENV === 'production',
    sameSite: 'lax' as const,
  };
  res.clearCookie('access_token', cookieOpts);
  res.clearCookie('refresh_token', cookieOpts);
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

export function createRefreshTokenForUser(
  jwtService: JwtService,
  user: UserResponsePayload,
): string {
  const payload: JwtRefreshPayload = {
    sub: user.id,
    email: user.email,
    tokenType: 'refresh',
  };
  return jwtService.sign(payload, {
    secret: CONFIG.JWT_REFRESH_SECRET,
    expiresIn: CONFIG.JWT_REFRESH_EXPIRATION_TIME,
  });
}

export function createTokensForUser(
  jwtService: JwtService,
  user: UserResponsePayload,
): { accessToken: string; refreshToken: string } {
  const accessToken = createTokenForUser(jwtService, user);
  const refreshToken = createRefreshTokenForUser(jwtService, user);
  return { accessToken, refreshToken };
}
