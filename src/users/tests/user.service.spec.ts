import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserEntity } from '../users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMockFactory } from './factories';
describe('UsersService', () => {
  let service: UsersService;
  const userData = { email: 'mail@mail.com', password: 'password' };

  beforeEach(async () => {
    const userMockFactory = new UserMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useValue: userMockFactory },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates new user', async () => {
    const user = await service.create(userData);

    expect(user.email).toEqual(userData.email);
    expect(user.password).toEqual(userData.password);
  });

  it('finds new user', async () => {
    const user = await service.create(userData);

    const foundUser = await service.findOne(user.id);

    expect(foundUser.id).toEqual(user.id);
  });

  it('updates new user', async () => {
    const user = await service.create(userData);
    const newMail = 'newmail@mail.com';

    const updatedUser = await service.update(user.id, {
      email: newMail,
    });

    expect(updatedUser.email).toEqual(newMail);
  });
});
