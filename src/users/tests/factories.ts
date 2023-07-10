import { MockFactory } from '../../common/tests/factories';
import { UserEntity } from '../users.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserFindParams } from '../users.service';
import { FindManyOptions } from 'typeorm';

export class UserMockFactory extends MockFactory<UserEntity, CreateUserDto> {
  create(data: CreateUserDto): UserEntity {
    return {
      id: this.storage.length,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
    };
  }

  find(params?: FindManyOptions<UserEntity>): UserEntity[] {
    let filteredUsers: UserEntity[] = [];

    if (params) {
      filteredUsers = this.storage.filter(
        (user) => user.email === params.where['email'],
      );
    } else {
      filteredUsers = this.storage;
    }

    return filteredUsers;
  }
}
