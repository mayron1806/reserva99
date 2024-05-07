import { HttpService } from '@nestjs/axios';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bull';
import { TokenService } from '../subscription/token.service';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { EfiGetNotification } from '../subscription/types/efi';
type JobData = {
  token: string;
}
@Processor('webhook-efi')
export class WebHookConsumer {
  private readonly logger = new Logger();
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  @Process()
  async process(job: Job<JobData>) {
    const { data } = await this.httpService.axiosRef.get<EfiGetNotification>(
      `notification/${job.data.token}`, 
      { headers: { 'Authorization': `Bearer ${await this.tokenService.getAccessToken()}` } }
    );
    this.logger.debug(data);
    const projectId = data.data[0].custom_id;
    const project = await this.txHost.tx.company.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    // separar eventos
    const decrescentNotification = data.data.sort((a, b) => b.id - a.id);
    const charges = decrescentNotification.filter(n => n.type === 'subscription_charge');
    const subscription = decrescentNotification.filter(n => n.type === 'subscription');
    let canceled = false;
    if (charges.length > 0) {
      switch(charges[0].status.current) {
        case 'unpaid':
        case 'refunded':
        case 'contested':
        case 'canceled':
          await this.txHost.tx.company.update({
            where: { id: projectId },
            data: { 
              gatewaySubscriptionStatus: 'Canceled',
              gatewaySubscriptionId: charges[0].identifiers.subscription_id.toString()
            },
          });
          canceled = true;
          break;
      }
    }
    if (subscription.length > 0 && !canceled) {
      switch(subscription[0].status.current) {
        case 'new':
          await this.txHost.tx.company.update({
            where: { id: projectId },
            data: { 
              gatewaySubscriptionStatus: 'Creating',
              gatewaySubscriptionId: subscription[0].identifiers.subscription_id.toString()
            },
          });
          break;
        case 'active':
          await this.txHost.tx.company.update({
            where: { id: projectId },
            data: { 
              gatewaySubscriptionStatus: 'Active',
              gatewaySubscriptionId: subscription[0].identifiers.subscription_id.toString()
            },
          });
          break;
        case 'canceled':
          await this.txHost.tx.company.update({
            where: { id: projectId },
            data: { 
              gatewaySubscriptionStatus: 'Canceled',
              gatewaySubscriptionId: subscription[0].identifiers.subscription_id.toString()
            },
          });
          break;
      }
    }
  }
  @OnQueueFailed()
  async fail(job: Job<JobData>, err: Error) {
    this.logger.error('fail' + JSON.stringify(job.data));
    this.logger.error(err);
  }
  @OnQueueError()
  async error(job: Job<JobData>, err: Error) {
    this.logger.error('error'+ JSON.stringify(job.data));
    this.logger.error(err);
  }
}
