import { ReadEntityDto } from '../../common/dtos';
import { Expose, Type } from 'class-transformer';
import { ReadUserDto } from '../../users/dtos';

export class ReadReportDto extends ReadEntityDto {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;
}
