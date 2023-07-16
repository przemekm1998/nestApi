import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { CreateReportDto } from '../dtos';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from '../../users/dtos';
import { TokenDataInterface } from '../../auth/auth.interfaces';
import { ReportsService } from '../reports.service';
import { UserEntity } from '../../users/users.entity';

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
  let reportsService: ReportsService;
  let authTokens: TokenDataInterface;

  const userData: CreateUserDto = {
    email: 'mail@mail.com',
    password: 'password',
  };
  let user: UserEntity;

  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    reportsService = moduleFixture.get<ReportsService>(ReportsService);

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
          updatedAt: user.updatedAt,
        });
      });
  });

  it('/reports (GET) throws error for anonymous user', async () => {
    return agent.get('/reports').expect(401);
  });

  it('/reports (GET) returns list of reports', async () => {
    const report = await reportsService.create(reportData, user);

    agent.auth(authTokens.access, { type: 'bearer' });

    return agent
      .get('/reports')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(1);
        expect(res.body[0]).toMatchObject({
          id: report.id,
          price: report.price,
          make: report.make,
          model: report.model,
          year: report.year,
        });
      });
  });

  it('/reports/:id (GET) throws error for anonymous user', async () => {
    return agent.get('/reports/1').expect(401);
  });

  it('/reports/:id (GET) returns report instance', async () => {
    const report = await reportsService.create(reportData, user);

    agent.auth(authTokens.access, { type: 'bearer' });

    return agent
      .get(`/reports/${report.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
          id: report.id,
          price: report.price,
          make: report.make,
          model: report.model,
          year: report.year,
          lng: report.lng,
          lat: report.lat,
          mileage: report.mileage,
        });
      });
  });
});
