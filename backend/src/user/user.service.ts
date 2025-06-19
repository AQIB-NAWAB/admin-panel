import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: SignupDto): Promise<User> {
    const exists = await this.findByEmail(data.email);
    if (exists) {
      throw new BadRequestException('User with that email already exists');
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
