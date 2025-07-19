import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { 
  UserResponsePayload, 
  TokenResponse,
  JwtRefreshPayload 
} from './interfaces/jwt-payload.interface';
import { createTokensForUser } from '../common/utils/auth';
import CONFIG from '../config/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // TODO
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    data: LoginDto,
  ): Promise<TokenResponse> {
    const userEntity = await this.validateUser(data.email, data.password);

    const user: UserResponsePayload = {
      id: userEntity.id,
      email: userEntity.email,
    };

    const { accessToken, refreshToken } = createTokensForUser(this.jwtService, user);
    
    // Store refresh token in database
    await this.userService.updateRefreshToken(userEntity.id, refreshToken);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken,
      user 
    };
  }

  async signup(
    data: SignupDto,
  ): Promise<TokenResponse> {
    const exists = await this.userService.findByEmail(data.email);

    if (exists) throw new BadRequestException('User already exists');

    const userEntity = await this.userService.create(data);

    const user: UserResponsePayload = {
      id: userEntity.id,
      email: userEntity.email,
    };

    const { accessToken, refreshToken } = createTokensForUser(this.jwtService, user);
    
    // Store refresh token in database
    await this.userService.updateRefreshToken(userEntity.id, refreshToken);

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken,
      user 
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refresh_token, {
        secret: CONFIG.JWT_REFRESH_SECRET,
      }) as JwtRefreshPayload;

      // Check if token type is correct
      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Find user with this refresh token
      const user = await this.userService.findByRefreshToken(refresh_token);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the token belongs to the user
      if (user.id !== payload.sub) {
        throw new UnauthorizedException('Token mismatch');
      }

      const userPayload: UserResponsePayload = {
        id: user.id,
        email: user.email,
      };

      const { accessToken } = createTokensForUser(this.jwtService, userPayload);

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userService.clearRefreshToken(userId);
  }
}
