import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import { RATES } from './../src/rates/rates.service';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

  // TODO: rates
  it('/rates/today (GET)', () => {
    return request(app.getHttpServer())
      .get('/rates/today')
      .expect(200)
      .expect(RATES);
  });
});
