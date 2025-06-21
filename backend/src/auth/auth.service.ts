import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  JwtPayload,
  UserResponsePayload,
} from './interfaces/jwt-payload.interface';
import { createTokenForUser } from 'src/common/utils/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private signPayload(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    data: LoginDto,
  ): Promise<{ access_token: string; user: UserResponsePayload }> {
    const userEntity = await this.validateUser(data.email, data.password);

    const user: UserResponsePayload = {
      id: userEntity.id,
      email: userEntity.email,
    };

    const access_token = createTokenForUser(this.jwtService, user);

    return { access_token, user };
  }

  async signup(
    data: SignupDto,
  ): Promise<{ access_token: string; user: UserResponsePayload }> {
    const exists = await this.userService.findByEmail(data.email);

    if (exists) throw new BadRequestException('User already exists');

    const userEntity = await this.userService.create(data);

    const user: UserResponsePayload = {
      id: userEntity.id,
      email: userEntity.email,
    };

    const access_token = createTokenForUser(this.jwtService, user);

    return { access_token, user };
  }
}
