import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateSubscriptionRequestDto } from './dto/create-subscription.dto';
import { EfiGetSubscriptionLink, EfiPlan } from './types/efi';
import { plans } from 'src/constants/plan';
import moment from 'moment';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(
    private readonly httpService: HttpService, 
    private readonly tokenService: TokenService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}
  async getEfiPlans() {
    try {
      const { data, status } = await this.httpService.axiosRef.get<{code: number, data: EfiPlan[]}>(
        `plans`, 
        { headers: { 'Authorization': `Bearer ${await this.tokenService.getAccessToken()}` } }
      );
      if(status === 200) {
        return data.data;
      } else {
        throw new InternalServerErrorException("Erro ao buscar dados dos planos");
      }
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar dados dos planos");
    }
  }
  @Transactional<TransactionalAdapterPrisma>({
    timeout: 60000
  })
  async getSubscriptionLink(body: CreateSubscriptionRequestDto) {
    const planWithId = plans.find(p => p.id === body.planId);
    if (!planWithId) {
      throw new BadRequestException("O plano selecionado não existe.");
    }
    const company = await this.txHost.tx.company.findUnique({
      where: { id: body.projectId }
    });
    if (!company) throw new NotFoundException("Projeto não encontrado");
    if (
      company.gatewaySubscriptionStatus === 'Active' || 
      company.gatewaySubscriptionStatus === 'Creating' 
    ) throw new NotFoundException("Projeto já tem uma assinatura ativa");
    const efiPlans = await this.getEfiPlans();
    const efiPlan = efiPlans.find(p => p.name === planWithId.name);
    if (!efiPlan) {
      throw new BadRequestException("O plano selecionado está indisponível.");
    }
    try {
      const { data, status } = await this.httpService.axiosRef.post<EfiGetSubscriptionLink>(
        `plan/${efiPlan.plan_id}/subscription/one-step/link`,
        {
          items: [
            {
              name: planWithId.name,
              value: planWithId.price,
              amount: 1,
            },
          ],
          settings: {
            payment_method: 'credit_card',
            expire_at: moment().add(1, 'day').format('YYYY-MM-DD'),
            request_delivery_address: true,
          },
          metadata: {
            custom_id: body.projectId,
            notification_url: 'https://42bc-2804-1b3-c002-3404-3bfe-8044-a37e-9cfa.ngrok-free.app/api/payment/webhook/efi'
          }
        },
        { headers: { 'Authorization': `Bearer ${await this.tokenService.getAccessToken()}` } }
      );
      await this.txHost.tx.company.update({
        where: {
          id: body.projectId,
        },
        data: {
          plan: planWithId.name,
          gatewaySubscriptionStatus: 'Creating',
        }
      });
      if (status === 200) return { url: data.data.payment_url };
    } catch(error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar link para iniciar assinatura.');
    }
  }
}
