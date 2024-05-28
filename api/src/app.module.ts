import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from './modules/prisma/prisma.service';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './api/user/user.module';
import { PaymentModule } from './api/payment/payment.module';
import { CompanyModule } from './api/company/company.module';
import { BullModule } from '@nestjs/bull';
import { env } from 'src/constants/env';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    AuthModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [
            PrismaModule,
          ],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        })
      ],
      global: true,
      middleware: { mount: true },
    }),
    BullModule.forRoot({
      redis: {
        username: env.REDIS_USER,
        password: env.REDIS_PASSWORD,
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT),
      },
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: env.REDIS_URL,
        })
      }),
      isGlobal: true
    }),
    RepositoryModule,
    UserModule,
    PaymentModule,
    CompanyModule,
  ],
})
export class AppModule {}
