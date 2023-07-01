import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  Res,
  BadRequestException,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalLoginAuthGuard } from './local-login.auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthUtils } from './auth.utils';
import * as authConstants from './auth.constants';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthErrors } from './auth.constants';
import { UserEntity } from '../users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private authUtils: AuthUtils) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalLoginAuthGuard)
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokenData = this.authService.generateToken(req.user);
    this.authUtils.setAuthCookies(res, tokenData);

    return tokenData;
  }

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async createUser(@Body() body: CreateUserDto): Promise<UserEntity> {
    return await this.authService.signup(body.email, body.password);
  }

  @Post('token-refresh')
  @HttpCode(200)
  async tokenRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenDto,
  ) {
    const refreshToken = this.authUtils.getRefreshToken(req, body);

    if (!refreshToken) {
      throw new BadRequestException(AuthErrors.REFRESH_TOKEN_MISSING);
    }

    const payload = this.authService.getPayloadFromToken(refreshToken);
    const user = await this.authService.getUserFromTokenPayload(payload);
    const tokenData = this.authService.generateToken(user);

    this.authUtils.setAuthCookies(res, tokenData);

    return tokenData;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    // const refreshToken = this.authUtils.getRefreshToken(req, body);
    // blacklist token
    this.authUtils.removeAuthCookies(res);
    res.removeHeader(authConstants.AUTH_HEADER);
  }
}
