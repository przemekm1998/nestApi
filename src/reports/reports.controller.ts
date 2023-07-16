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
import { CurrentUser } from '../common/decorators';
import { UserEntity } from '../users/users.entity';
import { ReportEntity } from './reports.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtApiAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ReportEntity> {
    return await this.reportsService.create(body, user);
  }
}
