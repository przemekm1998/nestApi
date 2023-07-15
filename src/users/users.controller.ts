import {
  Controller,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './users.entity';
import { JwtApiAuthGuard } from '../auth/jwt-api.auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtApiAuthGuard)
  me(@Req() req: Request): UserEntity {
    return req.user;
  }

  @Get(':id')
  @UseGuards(JwtApiAuthGuard)
  async findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  @UseGuards(JwtApiAuthGuard)
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find({ email });
  }

  @Patch('update')
  @UseGuards(JwtApiAuthGuard)
  async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.update(req.user.id, body);
  }
}
