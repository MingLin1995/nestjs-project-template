import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health status "ok"', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.message).toBe('API 連線正常');
      expect(result.version).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });
});
