const CONFIG = {
  PORT: process.env.PORT || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  LOW_STOCK_THRESHOLD: process.env.LOW_STOCK_THRESHOLD || 5,
  JWT_SECRET: process.env.JWT_SECRET || 'default',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-default',
  IMGBB_API_KEY: process.env.IMGBB_API_KEY,
  ENV: process.env.NODE_ENV || 'development',
  COOKIE_EXPIRATION_TIME: process.env.COOKIE_EXPIRATION_TIME || 1,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '15m',
  JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
};

export default CONFIG;
