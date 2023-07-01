import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import * as authConstants from './auth.constants';
import { TokenDataInterface } from './auth.interfaces';
import { AuthConfigInterface } from '../configuration/interfaces';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthUtils {
  constructor(private configService: ConfigService) {}

  setAuthCookies(res: Response, tokenData: TokenDataInterface) {
    res.cookie(authConstants.JWT_ACCESS_TOKEN_COOKIE_NAME, tokenData.access, {
      maxAge:
        parseInt(
          this.configService
            .get<AuthConfigInterface>('auth')
            .accessLifetime.replace('s', ''),
        ) * 1000,
      httpOnly: true,
    });

    res.cookie(authConstants.JWT_REFRESH_TOKEN_COOKIE_NAME, tokenData.refresh, {
      maxAge:
        parseInt(
          this.configService
            .get<AuthConfigInterface>('auth')
            .refreshLifetime.replace('s', ''),
        ) * 1000,
      httpOnly: true,
    });
  }

  removeAuthCookies(res: Response) {
    res.clearCookie(authConstants.JWT_REFRESH_TOKEN_COOKIE_NAME);
    res.clearCookie(authConstants.JWT_ACCESS_TOKEN_COOKIE_NAME);
  }

  getRefreshToken(req: Request, data: RefreshTokenDto): string | null {
    return (
      data.refresh ?? req.cookies[authConstants.JWT_REFRESH_TOKEN_COOKIE_NAME]
    );
  }
}
