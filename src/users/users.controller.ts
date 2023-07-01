import {
  Controller,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './users.entity';
import { JwtApiAuthGuard } from '../auth/jwt-api.auth.guard';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtApiAuthGuard)
  me(@Req() req: Request): UserEntity {
    return req.user;
  }
}
