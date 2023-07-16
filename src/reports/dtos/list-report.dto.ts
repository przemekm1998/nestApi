import { BaseEntityDto } from '../../common/dtos';
import { Expose } from 'class-transformer';

export class ListReportDto extends BaseEntityDto {
  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;
}
