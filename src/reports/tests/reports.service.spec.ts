import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { ReportMockFactory } from './factories';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportEntity } from '../reports.entity';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const reportMockFactory = new ReportMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(ReportEntity),
          useValue: reportMockFactory,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
