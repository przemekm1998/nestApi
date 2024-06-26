import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { MileageRange, PriceRange, YearRange } from '../reports.constants';

export class CreateReportDto {
  @IsNumber()
  @Min(PriceRange.MIN_VALUE)
  @Max(PriceRange.MAX_VALUE)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(YearRange.MIN_VALUE)
  @Max(YearRange.MAX_VALUE)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(MileageRange.MIN_VALUE)
  @Max(MileageRange.MAX_VALUE)
  mileage: number;
}
