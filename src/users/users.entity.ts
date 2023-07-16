import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { ReportEntity } from '../reports/reports.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @OneToMany(() => ReportEntity, (report) => report.user, { cascade: true })
  reports: ReportEntity[];

  @Column()
  email: string;

  @Column()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
