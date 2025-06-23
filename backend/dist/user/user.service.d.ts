import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    create(data: SignupDto): Promise<User>;
}
