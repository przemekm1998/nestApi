import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UserEntity } from '../users.entity';
import { Request } from 'express';
import { UserMockFactory } from './factories';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let userMockFactory: UserMockFactory;

  beforeEach(async () => {
    userMockFactory = new UserMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return request user on /me', () => {
    const user = userMockFactory.save(
      userMockFactory.create({
        email: 'mail@mail.com',
        password: 'password',
      }),
    );
    const request = { user: user } as Request;

    const requestUser = controller.me(request);

    expect(requestUser.id).toEqual(user.id);
  });

  it('should update the user on /update', async () => {
    const user = userMockFactory.save(
      userMockFactory.create({
        email: 'mail@mail.com',
        password: 'password',
      }),
    );
    const request = { user: user } as Request;
    const newMail = 'newmail@mail.com';

    const updatedUser = await controller.update(request, { email: newMail });

    expect(updatedUser.email).toEqual(newMail);
  });

  it('should find user with id', async () => {
    const user = userMockFactory.save(
      userMockFactory.create({
        email: 'mail@mail.com',
        password: 'password',
      }),
    );

    const foundUser = await controller.findUser(user.id.toString());

    expect(foundUser.id).toEqual(user.id);
  });

  it('should query user by id', async () => {
    const user = userMockFactory.save(
      userMockFactory.create({
        email: 'mail@mail.com',
        password: 'password',
      }),
    );

    const [foundUser] = await controller.findAllUsers(user.email);

    expect(foundUser.id).toEqual(user.id);
  });
});
