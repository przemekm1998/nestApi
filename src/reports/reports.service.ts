import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './reports.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { GetEstimateDto } from './dtos';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  create(data: CreateReportDto, user: UserEntity) {
    const report = this.reportRepository.create(data);
    report.user = user;

    return this.reportRepository.save(report);
  }

  async list() {
    return await this.reportRepository.find();
  }

  async get(id: number) {
    return await this.reportRepository.findOne({ where: { id } });
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.get(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return await this.reportRepository.save(report);
  }

  createEstimate(estimateDto: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('approved IS TRUE')
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne<ReportEntity>();
  }
}
