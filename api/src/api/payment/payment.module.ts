import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RouterModule } from '@nestjs/core';
import { SubscriptionModule } from './subscription/subscription.module';
import { BullModule } from '@nestjs/bull';
import { WebHookConsumer } from './jobs/webhook.consumer';
import { HttpModule } from '@nestjs/axios';
import { env } from 'src/constants/env';
import { TokenService } from './subscription/token.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, WebHookConsumer, TokenService],
  imports: [
    SubscriptionModule,
    BullModule.registerQueue({
      name: 'webhook-efi',
    }),
    HttpModule.register({
      baseURL: env.EFI_BASE_URL,
    }),
    RouterModule.register([
      {
        path: 'payment',
        children: [
          {
            path: 'subscription',
            module: SubscriptionModule,
          }
        ]
      }
    ])
  ]
})
export class PaymentModule {}
