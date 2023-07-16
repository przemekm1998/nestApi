import { Expose } from 'class-transformer';
import { BaseEntityDto } from './base-entity.dto';

export class ReadEntityDto extends BaseEntityDto {
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
