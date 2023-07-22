import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtApiAuthGuard } from '../auth/jwt-api.auth.guard';
import { CurrentUser, Serialize } from '../common/decorators';
import { UserEntity } from '../users/users.entity';
import { ReadReportDto, CreateReportDto, ListReportDto } from './dtos';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
@UseGuards(JwtApiAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serialize(ReadReportDto)
  async createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.reportsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Serialize(ListReportDto)
  async listReports() {
    return await this.reportsService.list();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Serialize(ReadReportDto)
  async getReport(@Param('id') id: string) {
    return await this.reportsService.get(parseInt(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportsService.changeApproval(
      parseInt(id),
      body.approved,
    );
  }
}
