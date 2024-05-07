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
import { CacheModule as CM } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

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
    CM.register({
      store: redisStore,
      url: 'redis://default:5ad6627dc1171d868f7c@reserva99_redis:6379',
      ttl: 5 * 60,
      isGlobal: true
    }),
    RepositoryModule,
    UserModule,
    PaymentModule,
    CompanyModule,
  ],
})
export class AppModule {}
