import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalLoginStrategy } from './local-login.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtApiStrategy } from './jwt-api.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfigInterface } from '../configuration/interfaces';
import { AuthUtils } from './auth.utils';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<AuthConfigInterface>('auth').jwtSecret,
        signOptions: {
          expiresIn: '10m',
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, LocalLoginStrategy, JwtApiStrategy, AuthUtils],
  controllers: [AuthController],
})
export class AuthModule {}
