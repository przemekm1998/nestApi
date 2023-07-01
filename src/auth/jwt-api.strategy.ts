import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { AccessTokenPayloadInterface } from './auth.interfaces';
import { ConfigService } from '@nestjs/config';
import { AuthConfigInterface } from '../configuration/interfaces';
import { IUser } from '../@types';
import { Request } from 'express';
import * as jwtConstants from './auth.constants';
import { UsersService } from '../users/users.service';

function jwtCookieExtractor(): JwtFromRequestFunction {
  return (req: Request): string | null => {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies[jwtConstants.JWT_ACCESS_TOKEN_COOKIE_NAME];
    }

    return token;
  };
}

export const jwtExtractors = ExtractJwt.fromExtractors([
  jwtCookieExtractor(),
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtApiStrategy extends PassportStrategy(Strategy, 'jwtApi') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const authConfig = configService.get<AuthConfigInterface>('auth');
    super({
      jwtFromRequest: jwtExtractors,
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayloadInterface): Promise<IUser> {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
