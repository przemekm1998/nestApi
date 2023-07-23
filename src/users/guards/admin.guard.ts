import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = <Request>context.switchToHttp().getRequest();

    const user = request.user;
    if (user) {
      return user.isAdmin;
    }

    return false;
  }
}
