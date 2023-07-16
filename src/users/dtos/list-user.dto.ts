import { Expose, Exclude } from 'class-transformer';
import { ReadEntityDto } from '../../common/dtos';

export class ListUserDto extends ReadEntityDto {
  @Expose()
  email: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
