import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionRequestDto } from './dto/create-subscription.dto';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}
  
  // @Get()
  // async getByProject(@Project('id') projectId: string, @Query('include-canceled', ParseBoolPipe) includeCanceled: boolean) {
  //   const res = await this.subscriptionRepo.getByOrganization(id, includeCanceled,
  //     { 
  //       plan: { include: { items: true } },
  //       organization: true,
  //       billing: { include: { billing_address: true, customer_address: true }},
  //     }
  //   );
  //   if (!res) throw new NotFoundException('Nenhuma assinatura encontrada.');
  //   return GetSubscriptionResponseDto.mapToResponse(res);
  // }
  @Post('subscribe')
  async subscribe(
    @Body() data: CreateSubscriptionRequestDto,
  ) {
    return await this.subscriptionService.getSubscriptionLink(data);
  }
  // @Patch(':subId/update-client')
  // async updateClient(
  //   @Param('subId') subscriptionId: string, 
  //   @Body() body: EditSubscriptionClientDto,
  //   @Project('id') projectId: string
  // ) {
  //   return await this.subscriptionService.updateSubscriptionClient(subscriptionId, body, orgId);
  // }
  // @Patch(':subId/update-payment')
  // async updatePayment(
  //   @Param('subId') subscriptionId: string, 
  //   @Body() body: EditSubscriptionPaymentRequestDto,
  //   @Project('id') projectId: string
  // ) {
  //   return await this.subscriptionService.updatePayment(subscriptionId, body, orgId);
  // }
  // @Delete('cancel')
  // async cancelSubscription(
  //   @Project('id') projectId: string
  // ) {
  //   return await this.subscriptionService.cancelSubscription(orgId);
  // }
}
