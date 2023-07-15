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
import { RefreshTokenPayloadInterface } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtApiAuthGuard } from './jwt-api.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authUtils: AuthUtils,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

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
  @HttpCode(201)
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

    const payload = this.jwtService.decode(
      refreshToken,
    ) as RefreshTokenPayloadInterface;
    const user = await this.usersService.findOne(payload.id);
    const tokenData = this.authService.generateToken(user);

    this.authUtils.setAuthCookies(res, tokenData);

    return tokenData;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtApiAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    // const refreshToken = this.authUtils.getRefreshToken(req, body);
    // blacklist token
    this.authUtils.removeAuthCookies(res);
    res.removeHeader(authConstants.AUTH_HEADER);
  }
}
