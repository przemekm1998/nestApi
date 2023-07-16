import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { JwtApiAuthGuard } from '../auth/jwt-api.auth.guard';
import { CurrentUser, Serialize } from '../common/decorators';
import { UserEntity } from '../users/users.entity';
import { ReportEntity } from './reports.entity';
import { ReadReportDto } from './dtos/read-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtApiAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(ReadReportDto)
  async createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.reportsService.create(body, user);
  }
}
