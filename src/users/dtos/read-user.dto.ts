import { Expose } from 'class-transformer';
import { ReadEntityDto } from '../../common/dtos';

export class ReadUserDto extends ReadEntityDto {
  @Expose()
  email: string;
}
