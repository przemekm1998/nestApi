import { Expose } from 'class-transformer';

export class BaseEntityDto {
  @Expose()
  id: number;
}
