import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOrUpdateBlockRequest } from './dto/create-block';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlockService {
  private readonly logger = new Logger(BlockService.name);
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async getBlockByCompany(companyId: string) {
    const res = await this.txHost.tx.block.findUnique({ where: { companyId } });
    return res;
  }

  private validateMonthDays(dates: { month: number, day: number }[]): boolean {
    for (const date of dates) {
      if (date.month < 1 || date.month > 12) {
        return false; // Mês inválido
      }
      switch (date.month) {
        case 1: // Janeiro
        case 3: // Março
        case 5: // Maio
        case 7: // Julho
        case 8: // Agosto
        case 10: // Outubro
        case 12: // Dezembro
          if (date.day < 1 || date.day > 31) {
            return false; // Dia inválido
          }
          break;
        case 4: // Abril
        case 6: // Junho
        case 9: // Setembro
        case 11: // Novembro
          if (date.day < 1 || date.day > 30) {
            return false; // Dia inválido
          }
          break;
        case 2: // Fevereiro
          if (date.day < 1 || date.day > 29) {
            return false; // Dia inválido
          }
          break;
        default:
          return false; // Mês inválido
      }
    }

    return true; // Mês válido
  }
  async createOrUpdateBlock(companyId: string, body: CreateOrUpdateBlockRequest) {
    if (!this.validateMonthDays(body.dates)) {
      throw new BadRequestException('Verifique as datas informadas');
    }
    const res = await this.txHost.tx.block.upsert({
      where: { companyId },
      create: {
        ...body,
        dates: body.dates as unknown as Prisma.JsonArray,
        company: {
          connect: { id: companyId },
        },
      },
      update: {
        ...body,
        dates: body.dates as unknown as Prisma.JsonArray,
      }
    });
    return res;
  }
}
