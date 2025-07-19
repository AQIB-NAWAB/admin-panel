import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService - Token Functionality', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    refreshToken: null,
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
    findByRefreshToken: jest.fn(),
    clearRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token, refresh_token, and user on successful login', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 'test-id', email: 'test@example.com' },
      });
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        'test-id',
        'mock-refresh-token',
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access_token when refresh token is valid', async () => {
      const mockPayload = {
        sub: 'test-id',
        email: 'test@example.com',
        tokenType: 'refresh',
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserService.findByRefreshToken.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await authService.refreshToken({
        refresh_token: 'valid-refresh-token',
      });

      expect(result).toEqual({ access_token: 'new-access-token' });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refreshToken({ refresh_token: 'invalid-token' }),
      ).rejects.toThrow('Invalid or expired refresh token');
    });
  });

  describe('logout', () => {
    it('should clear refresh token for user', async () => {
      await authService.logout('test-id');

      expect(mockUserService.clearRefreshToken).toHaveBeenCalledWith('test-id');
    });
  });
});