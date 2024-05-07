import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class PaymentService {
  constructor(
    @InjectQueue('webhook-efi') private readonly webhookQueue: Queue,
  ) {}

  async efiWebHook(token: string) {
    await this.webhookQueue.add({ token }, { backoff: { 
      type: 'exponential', 
      delay: 1000 * 10 // 10 minutos
    }});
    return true;
  }
}
