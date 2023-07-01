export const JWT_ACCESS_TOKEN_COOKIE_NAME = 'access';
export const JWT_REFRESH_TOKEN_COOKIE_NAME = 'refresh';
export const AUTH_HEADER = 'Authorization';

export enum AuthErrors {
  REFRESH_TOKEN_MISSING = 'Refresh token not found in cookie or body',
  USER_ALREADY_EXISTS = 'User with this email exists',
}
