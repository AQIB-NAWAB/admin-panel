export declare class User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    comparePassword(password: string): Promise<boolean>;
}
