# Access Token and Refresh Token Implementation

This document describes the access token and refresh token implementation added to the admin panel backend.

## Overview

The authentication system now implements a dual-token approach:
- **Access Token**: Short-lived token (15 minutes) for API access
- **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

## API Endpoints

### Authentication Endpoints

#### POST /v1/auth/signup
Creates a new user account and returns both tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Cookies Set:**
- `access_token`: HttpOnly cookie with 15-minute expiration
- `refresh_token`: HttpOnly cookie with 7-day expiration

#### POST /v1/auth/login
Authenticates user and returns both tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

#### POST /v1/auth/refresh
Exchanges a valid refresh token for a new access token.

**Request:** No body required (uses refresh_token from cookies)

**Response:**
```json
{
  "message": "Token refreshed successfully"
}
```

**Cookies Set:**
- `access_token`: New HttpOnly cookie with 15-minute expiration

#### GET /v1/auth/me
Returns current user information (requires valid access token).

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

#### POST /v1/auth/logout
Logs out user and clears all tokens.

**Response:**
```json
{
  "message": "Logged out successfully."
}
```

**Effect:** Clears both cookies and removes refresh token from database

## Token Configuration

Environment variables for token configuration:

```env
# JWT Access Token Configuration
JWT_SECRET=your-access-token-secret
JWT_EXPIRATION_TIME=15m

# JWT Refresh Token Configuration  
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRATION_TIME=7d

# Legacy cookie config (still used for access token fallback)
COOKIE_EXPIRATION_TIME=1
```

## Security Features

1. **HttpOnly Cookies**: Tokens stored in HttpOnly cookies to prevent XSS attacks
2. **Secure Flags**: Cookies marked as secure in production environments
3. **Token Validation**: Refresh tokens validated against database storage
4. **Token Revocation**: Refresh tokens removed from database on logout
5. **Token Type Validation**: Prevents misuse of refresh tokens as access tokens
6. **User Binding**: Refresh tokens tied to specific users

## Database Changes

The `users` table now includes:
- `refreshToken` column (nullable string) to store the current refresh token

## Usage in Frontend

### Automatic Token Refresh
The frontend should implement automatic token refresh when receiving 401 responses:

```javascript
// Example axios interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axios.post('/v1/auth/refresh');
        // Retry original request
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Logout Implementation
```javascript
const logout = async () => {
  await axios.post('/v1/auth/logout');
  // Redirect to login page
  window.location.href = '/login';
};
```

## Migration Guide

### For Existing Implementations
The new implementation is backward compatible:
- Existing access token functionality continues to work
- New refresh token functionality is additive
- Old clients will still receive access tokens in cookies

### For New Implementations
Use the dual-token approach:
1. Store both tokens from login/signup responses
2. Implement automatic refresh on 401 responses
3. Clear both tokens on logout

## Testing

A comprehensive test suite is included:
- Unit tests for AuthService methods
- Integration tests for token flow
- Manual testing script available at `/tmp/test-token-flow.js`

To run manual tests:
```bash
# Start the backend server first
npm run start:dev

# In another terminal, run the test script
node /tmp/test-token-flow.js
```

## Common Issues

1. **Clock Skew**: Ensure server and client clocks are synchronized
2. **Cookie Issues**: Check that cookies are properly sent with requests
3. **Token Expiration**: Implement proper refresh logic before access tokens expire
4. **Database Migration**: Run migrations to add the refreshToken column to users table