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
    const user = await this.validateUser(data.email, data.password);

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.signPayload(payload),
      user: { id: user.id, email: user.email },
    };
  }

  async signup(
    data: SignupDto,
  ): Promise<{ access_token: string; user: UserResponsePayload }> {
    const exists = await this.userService.findByEmail(data.email);
    if (exists) {
      throw new BadRequestException('User with that email already exists');
    }

    const user = await this.userService.create(data);
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.signPayload(payload),
      user: { id: user.id, email: user.email },
    };
  }
}
