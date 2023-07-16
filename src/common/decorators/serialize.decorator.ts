import { UseInterceptors } from '@nestjs/common';
import { BaseEntityDto } from '../dtos';
import { SerializeInterceptor } from '../interceptors';

export function Serialize(dto: typeof BaseEntityDto) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
