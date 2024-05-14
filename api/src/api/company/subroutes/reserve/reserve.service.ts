import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Reserve } from '@prisma/client';
import moment from 'moment';
import { WeekTime, Time } from 'src/types/times';
import { CreateReserveRequestDto } from './dto/create-reserve';
import { Availability, TimeAvailability } from './types';
import { UpdateReserveRequestDto } from './dto/update-reserve';
import { GetBasicReserveResponseDto } from './dto/get-basic-reserve';

@Injectable()
export class ReserveService {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  private readonly granularity = 15;

  async getReserveById(companyId: string, reserveId: string) {
    const reserve = await this.txHost.tx.reserve.findUnique({
      where: { id: reserveId },
      include: { client: true, service: true, variant: true },
    });
    if (!reserve) throw new NotFoundException('Agendamento não encontrado.');
    if (reserve.companyId !== companyId) throw new NotFoundException('Você não tem permissão para acessar o agendamento.');
    return reserve;
  }
  async getReserves(companyId: string, month?: number, year?: number) {
    const minMonth = month && year ? moment().month(month).year(year).startOf('month') : undefined;
    const maxMonth = month && year ? moment().month(month).year(year).endOf('month') : undefined;
    const reserves = await this.txHost.tx.reserve.findMany({
      where: { 
        companyId, 
        startDate: minMonth && maxMonth ? { lte: maxMonth.toDate(), gte: minMonth.toDate()} : undefined,
      },
      include: { client: true, service: true, variant: true }
    });
    return reserves.map(r => 
      GetBasicReserveResponseDto.mapToResponse(r, r.client, r.service, r.variant)
    );
  }
  private getAvailableTimes(date: Date, weekTime: WeekTime, duration: number, reserves: Reserve[]) {
    const dayOfWeek = moment(date).weekday();
    let dayTimes = weekTime.monday;
    switch(dayOfWeek) {
      case 0:
        dayTimes = weekTime.sunday;
        break;
      case 1:
        dayTimes = weekTime.monday;
        break;
      case 2:
        dayTimes = weekTime.tuesday;
        break;
      case 3:
        dayTimes = weekTime.wednesday;
        break;
      case 4:
        dayTimes = weekTime.thursday;
        break;
      case 5:
        dayTimes = weekTime.friday;
        break;
      case 6:
        dayTimes = weekTime.saturday;
        break;
      default:
        throw new BadRequestException('Dia da semana inválido');
    }
    // array de horarios de 15 em 15 minutos
    let availableHours: Availability[] = [];
    dayTimes.forEach(dt => {
      const startHour = moment(date).hours(parseInt(dt.start.slice(0, 2))).minutes(parseInt(dt.start.slice(3, 5))).second(0).milliseconds(0);
      const endHour = moment(date).hours(parseInt(dt.end.slice(0, 2))).minutes(parseInt(dt.end.slice(3, 5))).second(0).milliseconds(0);
      let currentHour = startHour;
      
      let times: TimeAvailability[] = [];
      do {
        times.push({ time: currentHour.toDate(), available: true });
        currentHour.add(this.granularity, 'minutes');
      } while(moment(currentHour).isBefore(endHour));
      availableHours.push({
        start: startHour.toDate(),
        end: endHour.toDate(),
        times
      });
    });
    // remover conforme reservas
    availableHours = availableHours.map(availableHour => {
      // filtra as hora que estão sendo ocupadas por uma reserva
      const times = availableHour.times.map(({ available, time }) => {
        // caso ja tenha sido marcado como não disponivel então vai ignorar a hora
        if (!available) return { available, time };
        // verifica se alguma reserva esta na hora que esta sendo verificada
        const res = !reserves?.some(reserve => {
          return moment(time).isBetween(reserve.startDate, reserve.endDate, null, '[)');
        });
        return {
          time,
          available: res
        } as TimeAvailability
      });
      return {
        ...availableHour,
        times: times
      };
    }) as Availability[];

    // remover de acordo com duração do serviço
    const result = availableHours.map(availableHour => {
      // verificar se o tempo se encaixa
      const times = availableHour.times.map(({ available, time }, timeIndex) => {
        // caso ja tenha sido marcado como não disponivel então vai ignorar a hora.
        if (!available) return { available, time };
        // verifica se a hora atual + a duração vai passar da hora do fim de expediente.
        if (moment(moment(time).add(duration, 'seconds')).isAfter(availableHour.end)) {
          return { available: false, time };
        }
        // verifica se os proximos horarios estão disponiveis para agendamento de acordo com a duração.
        const durationInMinutes = duration / 60;
        const durationSteps = Math.floor(durationInMinutes / this.granularity);
        for (let index = 0; index < durationSteps; index++) {
          if (!availableHour.times.at(timeIndex + index)?.available) {
            return { available: false, time };
          }          
        }
        return { available: true, time };
      });
      return {
        ...availableHour,
        times: times,
      };
    });
   
    return result;
  }
  private verifyAvailability(timeAvailability: Availability[], startDate: Date, endDate: Date) {
    const res = timeAvailability.some(t => {
      let unavailable = false;
      let started = false;
      t.times.forEach(({ available, time }) => {
        if (unavailable) return;
        // se esta entre a hora de inicio e fim e não iniciou a validação
        if (moment(time).isBetween(startDate, endDate) && !started) {
          started = true;
        }
        if (started) {
          if (moment(time).isSameOrBefore(endDate)) {
            if (!available) {
              unavailable = true;
            }
          }
        }
      });
      return !unavailable;
    });
    return res;
  }
  private async getServiceData(serviceId: string, variantId?: string) {
    if (variantId) {
      const variant = await this.txHost.tx.variant.findUnique({ where: { id: variantId }});
      if (!variant) throw new NotFoundException('Variação não encontrada');
      return {
        duration: variant.duration,
        price: variant.price,
        description: variant.description,
      };
    } 
    const service = await this.txHost.tx.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    return {
      duration: service.duration,
      price: service.price,
      description: service.description,
    };
  }
  private async getReservesByDate(companyId: string, date: Date) {
    const minDate = moment(date).startOf('day').toDate();
    const maxDate = moment(date).endOf('day').toDate();
    return await this.txHost.tx.reserve.findMany({
      where: { companyId,  startDate: { gte: minDate, lte: maxDate } }
    });
  }
  async getDayAvailability(companyId: string, date: Date, serviceId: string, variantId?: string) {
    const companyTimes = await this.txHost.tx.times.findUnique({ where: { companyId }});
    const weekTimes: WeekTime = {
      friday: companyTimes.friday as Time[],
      monday: companyTimes.monday as Time[],
      saturday: companyTimes.saturday as Time[],
      sunday: companyTimes.sunday as Time[],
      thursday: companyTimes.thursday as Time[],
      tuesday: companyTimes.tuesday as Time[],
      wednesday: companyTimes.wednesday as Time[],
    }
    const reserves = await this.getReservesByDate(companyId, date);
    const { duration } = await this.getServiceData(serviceId, variantId);
    const res = this.getAvailableTimes(date, weekTimes, duration, reserves);
    return res.reduce<TimeAvailability[]>((acc, curr) => acc.concat(curr.times), []);
  }
  @Transactional()
  async createReserve(companyId: string, { date, serviceId, variantId, ...rest }: CreateReserveRequestDto) {
    if (!rest.client && !rest.clientId) throw new BadRequestException('Cliente não fornecido.');
    
    const companyTimes = await this.txHost.tx.times.findUnique({ where: { companyId }});
    const weekTimes: WeekTime = {
      friday: companyTimes.friday as Time[],
      monday: companyTimes.monday as Time[],
      saturday: companyTimes.saturday as Time[],
      sunday: companyTimes.sunday as Time[],
      thursday: companyTimes.thursday as Time[],
      tuesday: companyTimes.tuesday as Time[],
      wednesday: companyTimes.wednesday as Time[],
    }
    const { duration, price, description } = await this.getServiceData(serviceId, variantId);
    const reserves = await this.getReservesByDate(companyId, date);
    const availableTimes = this.getAvailableTimes(date, weekTimes, duration, reserves);
    const startDate = moment(date).seconds(0).milliseconds(0).toDate(); 
    const endDate = moment(startDate).add(duration, 'seconds').toDate();
    const isAvailable = this.verifyAvailability(availableTimes, startDate, endDate);
    
    if (!rest.hardSet && !isAvailable) throw new BadRequestException('O horário já está ocupado.');
    
    const reserve = await this.txHost.tx.reserve.create({
      data: {
        startDate,
        endDate,
        status: rest.status,
        paymentMethod: rest.paymentMethod,
        paymentStatus: rest.paymentStatus,
        description: rest.description ?? description,
        duration: rest.duration ?? duration,
        price: rest.price ?? price,
        company: { connect: { id: companyId } },
        service: { connect: { id: serviceId } },
        variant: variantId ? { connect: { id: variantId } } : undefined,
        client: rest.clientId ? { connect: { id: rest.clientId } } : {
          create: {
            alias: rest.client.alias,
            name: rest.client.name,
            phone: rest.client.phone,
            email: rest.client.email,
            company: { connect: { id: companyId } },
          }
        }
      }, 
    });
    await this.txHost.tx.client.update({
      where: { id: reserve.clientId },
      data: { lastReserveDate: startDate }
    });
    return reserve;
  }
  @Transactional()
  async updateReserveDate(companyId: string, reserveId: string, date: Date) {
    const reserve = await this.txHost.tx.reserve.findUnique({
      where: { id: reserveId },
    });
    if (!reserve) throw new NotFoundException('Agendamento não encontrado.');
    const companyTimes = await this.txHost.tx.times.findUnique({ where: { companyId }});
    const weekTimes: WeekTime = {
      friday: companyTimes.friday as Time[],
      monday: companyTimes.monday as Time[],
      saturday: companyTimes.saturday as Time[],
      sunday: companyTimes.sunday as Time[],
      thursday: companyTimes.thursday as Time[],
      tuesday: companyTimes.tuesday as Time[],
      wednesday: companyTimes.wednesday as Time[],
    }
    const { duration } = await this.getServiceData(reserve.serviceId, reserve.variantId);
    const reserves = await this.getReservesByDate(companyId, date);
    const availableTimes = this.getAvailableTimes(date, weekTimes, duration, reserves);
    const startDate = moment(date).seconds(0).milliseconds(0).toDate(); 
    const endDate = moment(startDate).add(duration, 'seconds').toDate();
    const isAvailable = this.verifyAvailability(availableTimes, startDate, endDate);
    
    if (!isAvailable) throw new BadRequestException('O horário já está ocupado');
    const updatedReserve = await this.txHost.tx.reserve.update({
      where: { id: reserveId },
      data: {
        startDate,
        endDate,
      },
    });
    await this.txHost.tx.client.update({
      where: { id: reserve.clientId },
      data: { lastReserveDate: startDate }
    });
    return updatedReserve;
  }
  async updateReserve(companyId: string, reserveId: string, body: UpdateReserveRequestDto) {
    const reserve = await this.txHost.tx.reserve.findUnique({ where: { id: reserveId }});
    if (!reserve) throw new NotFoundException('Agendamento não encontrado.');
    if (reserve.companyId !== companyId) throw new ForbiddenException('Você não tem acesso ao agendamento.');
    const updatedReserve = await this.txHost.tx.reserve.update({
      where: { id: reserveId },
      data: {
        paymentMethod: body.paymentMethod ?? reserve.paymentMethod,
        paymentStatus: body.paymentStatus ?? reserve.paymentStatus,
        status: body.status ?? reserve.status,
      },
    });
    return updatedReserve;
  }
  async deleteReserve(companyId: string, reserveId: string) {
    const res = await this.txHost.tx.reserve.delete({
      where: { 
        companyId, id: reserveId,
      },
    });
    if (!res) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    return res;
  }
}
