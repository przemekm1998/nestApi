import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '../../users/users.entity';

export const CurrentUser = createParamDecorator((data, ctx) => {
  const request = <Request>ctx.switchToHttp().getRequest();
  return request.user as UserEntity;
});
