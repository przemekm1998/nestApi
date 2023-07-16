import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { CreateReportDto } from '../dtos/create-report.dto';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../@types';
import { CreateUserDto } from '../../users/dtos';
import { TokenDataInterface } from '../../auth/auth.interfaces';

describe('ReportsController (e2e)', () => {
  let app: INestApplication;
  const reportData: CreateReportDto = {
    price: 100,
    make: 'honda',
    model: 'civic',
    year: 2000,
    mileage: 1000,
    lng: 0,
    lat: 0,
  };

  let authService: AuthService;
  let authTokens: TokenDataInterface;

  const userData: CreateUserDto = {
    email: 'mail@mail.com',
    password: 'password',
  };
  let user: IUser;

  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    user = await authService.signup(userData.email, userData.password);
    authTokens = await authService.generateToken(user);

    app = moduleFixture.createNestApplication();
    await app.init();

    agent = request.agent(app.getHttpServer());
  });

  it('/reports (POST) throws error for anonymous user', async () => {
    return agent.post('/reports').send(reportData).expect(401);
  });

  it('/reports (POST) creates report', async () => {
    agent.auth(authTokens.access, { type: 'bearer' });

    return agent
      .post('/reports')
      .send(reportData)
      .expect(201)
      .then((res) => {
        const { id, make, model, year, price, mileage, user } = res.body;

        expect(id).toBeDefined();
        expect(make).toEqual(reportData.make);
        expect(model).toEqual(reportData.model);
        expect(year).toEqual(reportData.year);
        expect(price).toEqual(reportData.price);
        expect(mileage).toEqual(reportData.mileage);

        expect(user).toMatchObject({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.upadtedAt,
        });
      });
  });
});
