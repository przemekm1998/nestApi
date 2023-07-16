import { MockFactory } from '../../common/tests/factories';
import { ReportEntity } from '../reports.entity';
import { FindManyOptions } from 'typeorm';
import { CreateReportDto } from '../dtos/create-report.dto';

export class ReportMockFactory extends MockFactory<
  ReportEntity,
  CreateReportDto
> {}
