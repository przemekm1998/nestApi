import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

export type UserFindParams = {
  email?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  create(data: CreateUserDto) {
    const user = this.repo.create({
      password: data.password,
      email: data.email,
    });
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(params?: UserFindParams) {
    return this.repo.find({ where: params });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, data);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return await this.repo.remove(user);
  }
}
