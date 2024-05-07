import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOrUpdateTimeRequest } from './dto/create-time';
import { Prisma } from '@prisma/client';

@Injectable()
export class TimeService {
  private readonly logger = new Logger(TimeService.name);
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  private validateHours(body: CreateOrUpdateTimeRequest) {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach(day => {
      if (body[day]) {
        body[day].forEach(time => {
          // Validar se a hora de end é superior à hora de start
          if (time.end.hour < time.start.hour) {
            throw new BadRequestException(`A hora de término é anterior à hora de início para o dia ${day}`);
          } else if (time.end.hour === time.start.hour && time.end.minutes <= time.start.minutes) {
            throw new BadRequestException(`A hora de término é igual ou anterior à hora de início para o dia ${day}`);
          }
        });
      }
    });
    return true;
  }
  async getTimeByCompany(companyId: string) {
    const res = await this.txHost.tx.times.findUnique({
      where: { companyId }
    });
    if(!res) return {};
    return res;
  }
  async createOrUpdateTime(companyId: string, body: CreateOrUpdateTimeRequest) {
    const validHours = this.validateHours(body);
    if(!validHours) {
      throw new BadRequestException('Verifique os dados das horas informados.');
    }
    const times = await this.txHost.tx.times.upsert({
      where: {
        companyId: companyId,
      },
      create: {
        company: { connect: { id: companyId } },
        monday: body.monday ? body.monday as unknown as Prisma.JsonArray : [],
        tuesday: body.tuesday ? body.tuesday as unknown as Prisma.JsonArray : [],
        wednesday: body.wednesday ? body.wednesday as unknown as Prisma.JsonArray : [],
        thursday: body.thursday ? body.thursday as unknown as Prisma.JsonArray : [],
        friday: body.friday ? body.friday as unknown as Prisma.JsonArray : [],
        saturday: body.saturday ? body.saturday as unknown as Prisma.JsonArray : [],
        sunday: body.sunday ? body.sunday as unknown as Prisma.JsonArray : [],
      },
      update: {
        monday: body.monday ? body.monday as unknown as Prisma.JsonArray : [],
        tuesday: body.tuesday ? body.tuesday as unknown as Prisma.JsonArray : [],
        wednesday: body.wednesday ? body.wednesday as unknown as Prisma.JsonArray : [],
        thursday: body.thursday ? body.thursday as unknown as Prisma.JsonArray : [],
        friday: body.friday ? body.friday as unknown as Prisma.JsonArray : [],
        saturday: body.saturday ? body.saturday as unknown as Prisma.JsonArray : [],
        sunday: body.sunday ? body.sunday as unknown as Prisma.JsonArray : [],
      }
    });
    return times;
  }
}
