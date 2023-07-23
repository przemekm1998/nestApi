import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtApiAuthGuard extends AuthGuard('jwtApi') {}
