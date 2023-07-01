import { IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refresh: string;
}
