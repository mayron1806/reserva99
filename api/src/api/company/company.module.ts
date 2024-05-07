import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { StorageModule } from 'src/modules/storage/storage.module';
import { ReserveModule } from './subroutes/reserve/reserve.module';
import { CashflowModule } from './subroutes/cashflow/cashflow.module';
import { RouterModule } from '@nestjs/core';
import { ServicesModule } from './subroutes/services/services.module';
import { MemberModule } from './subroutes/member/member.module';
import { BlockModule } from './subroutes/block/block.module';
import { TimeModule } from './subroutes/time/time.module';
import { ClientModule } from './subroutes/client/client.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    StorageModule, 
    ReserveModule, 
    CashflowModule, 
    ServicesModule,
    MemberModule,
    BlockModule,
    TimeModule,
    ClientModule,
    RouterModule.register([
      {
        path: 'company/:companyIdentifier',
        children: [
          {
            path: 'client',
            module: ClientModule
          },
          {
            path: 'service',
            module: ServicesModule
          },
          {
            path: 'time',
            module: TimeModule
          },
          {
            path: 'block',
            module: BlockModule
          },
          {
            path: 'reserve',
            module: ReserveModule
          },
          {
            path: 'cashflow',
            module: CashflowModule
          },
          {
            path: 'member',
            module: MemberModule
          },
        ]
      }
    ]),

  ]
})
export class CompanyModule {}
