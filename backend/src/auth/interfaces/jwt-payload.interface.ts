export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  tokenType: 'refresh';
}

export interface UserResponsePayload {
  id: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponsePayload;
}
