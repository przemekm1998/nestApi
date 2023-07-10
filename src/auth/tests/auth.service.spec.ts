import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from 'src/@types';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from '../auth.service';
import { UsersService, UserFindParams } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: IUser[] = [];
    fakeUsersService = {
      find: (params?: UserFindParams) => {
        let filteredUsers: IUser[] = [];

        if (params) {
          filteredUsers = users.filter((user) => user.email === params.email);
        } else {
          filteredUsers = users;
        }

        return Promise.resolve(filteredUsers);
      },
      create: (data: CreateUserDto): Promise<IUser> => {
        const user = {
          id: users.length,
          email: data.email,
          password: data.password,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password', async () => {
    const userData = { email: 'mail@mail.com', password: 'password' };

    const user = await service.signup(userData.email, userData.password);

    expect(user.email).toEqual(userData.email);
    expect(user.password).not.toEqual(userData.password);
  });

  it('throws an error if users signs up with already existing email', async () => {
    const existingEmail = 'mail@mail.com';
    await service.signup(existingEmail, 'password');

    await expect(service.signup(existingEmail, 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns user if password and email is valid', async () => {
    const existingUserData = { email: 'mail@mail.com', password: 'password' };
    await service.signup(existingUserData.email, existingUserData.password);

    const user = await service.validateUser(
      existingUserData.email,
      existingUserData.password,
    );

    expect(user).toBeDefined();
  });

  it('returns null if user is not found', async () => {
    const user = await service.validateUser('mail@mail.com', 'password');
    expect(user).toBeNull();
  });

  it('returns null if password do not match email', async () => {
    const existingUserData = { email: 'mail@mail.com', password: 'password' };
    service.signup(existingUserData.email, existingUserData.password);

    const user = await service.validateUser(
      existingUserData.email,
      'wrongPassword',
    );

    expect(user).toBeNull();
  });
});
