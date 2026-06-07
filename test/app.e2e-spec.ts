import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ExtendedPrismaService } from '../src/common/prisma/extended-prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ExtendedPrismaService)
      .useValue({
        onModuleInit: async () => {},
        onModuleDestroy: async () => {},
        client: {
          // Add any mock prisma client operations if needed
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.message).toBe('Success');
        expect(res.body.data).toBeDefined();
        expect(res.body.data.status).toBe('ok');
        expect(res.body.data.message).toBe('API 連線正常');
      });
  });
});
