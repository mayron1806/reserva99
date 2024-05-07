import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './token.service';
import { env } from 'src/constants/env';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, TokenService],
  imports: [HttpModule.register({
    baseURL: env.EFI_BASE_URL,
  })],
})
export class SubscriptionModule {}
