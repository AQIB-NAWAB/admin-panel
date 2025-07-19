declare const CONFIG: {
    PORT: string | number;
    FRONTEND_URL: string;
    LOW_STOCK_THRESHOLD: string | number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    IMGBB_API_KEY: string | undefined;
    ENV: string;
    COOKIE_EXPIRATION_TIME: string | number;
    JWT_EXPIRATION_TIME: string;
    JWT_REFRESH_EXPIRATION_TIME: string;
};
export default CONFIG;
