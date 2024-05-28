import { Process, Processor, OnGlobalQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/modules/email/email.service';
import { Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import moment from 'moment';
moment().locale('pt-BR');

type SendEmailProps = {
  reserveId: string
}
@Processor('remember-reserve')
export class RememberReserveConsumer {
  private readonly logger = new Logger()
  constructor(
    private readonly emailService: EmailService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  @OnGlobalQueueFailed()
  handler(job: Job, error: Error) {
    console.log(job);
    console.error(error);
  }
  @Process('send-email')
  async sendEmail(job: Job<SendEmailProps>) {
    this.logger.log('send remember e-mail')
    const reserveId = job.data.reserveId;
    const reserve = await this.txHost.tx.reserve.findUnique({ where: { id: reserveId }, include: { service: true, client: true }});
    const usersToNotify = await this.txHost.tx.user.findMany({ where: { companies: { some: { companyId: reserve.companyId } } }});
    const tasks = usersToNotify.map(async (user) => {
      await this.emailService.sendEmailFromTemplate(
        user.email,
        'Agendamento',
        'remember-reserve',
        {
          name: user.name ?? user.nick,
          date: moment(reserve.startDate).locale('pt-BR').format('LLLL'),
          client: reserve.client.name,
          service: reserve.service.name
        }, 
      );
    });
    await Promise.allSettled(tasks);
    this.logger.log("End send remember e-mail");
  }
}
