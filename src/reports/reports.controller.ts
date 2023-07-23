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
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtApiAuthGuard } from '../auth/guards';
import { CurrentUser, Serialize } from '../common/decorators';
import { UserEntity } from '../users/users.entity';
import {
  ReadReportDto,
  CreateReportDto,
  ListReportDto,
  ApproveReportDto,
  GetEstimateDto,
} from './dtos';
import { AdminGuard } from '../users/guards/admin.guard';

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
  @UseGuards(AdminGuard)
  @Serialize(ReadReportDto)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportsService.changeApproval(
      parseInt(id),
      body.approved,
    );
  }

  @Get('estimate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtApiAuthGuard)
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.createEstimate(query);
  }
}
