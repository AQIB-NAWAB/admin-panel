import { User } from '../user/user.entity';
export declare class Product {
    id: string;
    name: string;
    image: string;
    description?: string;
    price: number;
    stock: number;
    owner: User;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}
