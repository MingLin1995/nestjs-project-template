import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
// import { NotificationsModule } from './notifications/notifications.module';
// 需要的套件：
//   - Email: npm install @nestjs-modules/mailer nodemailer handlebars
//   - LINE:  npm install @line/bot-sdk
//   - SMS:   無需額外套件（使用內建 HttpModule）

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 ses
        limit: 10,  // 10 requests
      },
    ]),
    AuthModule,
    UsersModule,
    // NotificationsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
