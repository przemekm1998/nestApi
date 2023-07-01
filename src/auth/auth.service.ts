import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayloadInterface,
  TokenDataInterface,
} from './auth.interfaces';
import { IUser } from '../@types';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayloadInterface } from './auth.interfaces';
import { AuthErrors } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const [user] = await this.userService.find({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  generateToken(user: IUser): TokenDataInterface {
    const accessPayload: AccessTokenPayloadInterface = {
      id: user.id,
      email: user.email,
    };
    const refreshPayload: RefreshTokenPayloadInterface = { id: user.id };

    return {
      access: this.jwtService.sign(accessPayload),
      refresh: this.jwtService.sign(refreshPayload),
    };
  }

  async signup(email: string, password: string): Promise<IUser> {
    const users = await this.userService.find({ email });

    if (users.length) {
      throw new Error(AuthErrors.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userService.create({
      email: email,
      password: hashedPassword,
    });

    return user;
  }
}
