import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { plans } from 'src/constants/plan';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('plans')
  async getPlans() {
    return plans;
  }

  @Post('webhook/efi')
  @HttpCode(200)
  async efiWebhook(@Body('notification') notificationToken: string) {
    return await this.paymentService.efiWebHook(notificationToken);
  }
}
