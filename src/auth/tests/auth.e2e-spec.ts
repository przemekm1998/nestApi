import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { AuthService } from '../auth.service';
import { clearDb } from '../../tests/setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', async () => {
    const email = 'mail@mail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('/auth/login (POST)', async () => {
    const userData = { email: 'mail2@mail.com', password: 'password' };
    await authService.signup(userData.email, userData.password);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userData)
      .expect(200)
      .then((res) => {
        const { access, refresh } = res.body;
        expect(access).toBeDefined();
        expect(refresh).toBeDefined();
        expect(res.headers['set-cookie'].length).toEqual(2);
      });
  });
});
