import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';

@Entity()
export class ReportEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.reports)
  user: UserEntity;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  approved: boolean;

  constructor(partial: Partial<ReportEntity>) {
    super();
    Object.assign(this, partial);
  }
}
