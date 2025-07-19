export declare class User {
    id: string;
    email: string;
    password: string;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    comparePassword(password: string): Promise<boolean>;
    updateRefreshToken(refreshToken: string): void;
    clearRefreshToken(): void;
}
