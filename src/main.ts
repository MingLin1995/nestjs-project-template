import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 啟用 CORS
  //app.enableCors();

  // 全域驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const packageJsonPath = path.resolve(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const config = new DocumentBuilder()
    .setTitle('NestJS Template API')
    .setDescription('NestJS Template API')
    .setVersion(`v${packageJson.version}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  const port = process.env.PORT || 3000; // 對內 port
  const appPort = process.env.APP_PORT || 3000; // 對外 port

  await app.listen(port);

  console.info('');
  console.info('Application is ready');
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info(`API URL:        http://localhost:${appPort}`);
  console.info(`Swagger Docs:   http://localhost:${appPort}/apidoc`);
  console.info(`Version:        v${packageJson.version}`);
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('');
}

bootstrap();
