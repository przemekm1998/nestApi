import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbConfigInterface } from './configuration/interfaces';
import { ReportsModule } from './reports/reports.module';
import * as cookieParser from 'cookie-parser';
import config from './configuration';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : '.',
      ignoreEnvFile: process.env.NODE_ENV !== 'test',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
        url: configService.get<DbConfigInterface>('database').url,
      }),
      inject: [ConfigService],
    }),
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe() },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const conf = config();
    consumer.apply(cookieParser(conf.auth.jwtSecret)).forRoutes('*');
  }
}
