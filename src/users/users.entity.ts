import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
