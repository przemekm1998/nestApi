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
import { JwtApiAuthGuard } from '../auth/guards';
import { UpdateUserDto, ReadUserDto, ListUserDto } from './dtos';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators';
import { Serialize } from '../common/decorators';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtApiAuthGuard)
  @Serialize(ReadUserDto)
  me(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtApiAuthGuard)
  @Serialize(ListUserDto)
  async findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  @UseGuards(JwtApiAuthGuard)
  @Serialize(ListUserDto)
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find({ email });
  }

  @Patch('update')
  @UseGuards(JwtApiAuthGuard)
  @Serialize(ReadUserDto)
  async update(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.update(req.user.id, body);
  }
}
