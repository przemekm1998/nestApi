import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import config from './configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const conf = config();
  app.use(cookieParser(conf.auth.jwtSecret));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
