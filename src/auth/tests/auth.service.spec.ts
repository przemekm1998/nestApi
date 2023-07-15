import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from 'src/@types';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { UserMockFactory } from '../../users/tests/factories';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../users/users.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userMockFactory = new UserMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        UsersService,
        { provide: getRepositoryToken(UserEntity), useValue: userMockFactory },
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
