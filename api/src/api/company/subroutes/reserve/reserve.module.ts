import { Module } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { CashflowModule } from '../cashflow/cashflow.module';
import { BullModule } from '@nestjs/bull';
import { RememberReserveConsumer } from './jobs/remember-reserve.consumer';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
  controllers: [ReserveController],
  providers: [ReserveService, RememberReserveConsumer],
  imports: [
    CashflowModule,
    BullModule.registerQueue({
      name: 'remember-reserve',
    }),
    EmailModule,
  ],
})
export class ReserveModule {}
