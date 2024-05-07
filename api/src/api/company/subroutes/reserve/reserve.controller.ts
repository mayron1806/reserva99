import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CompanyGuard } from 'src/guard/company.guard';
import { Public } from 'src/decorators/public.decorator';
import { Company } from 'src/decorators/company.decorator';
import { CreateReserveRequestDto } from './dto/create-reserve';
import { UpdateReserveDateRequestDto } from './dto/update-reserve-date';
import { UpdateReserveRequestDto } from './dto/update-reserve';
import moment from 'moment';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}
  
  @Get()
  async getList(
    @Company('id') companyId: string,
    @Query('month', ParseIntPipe) month?: number,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return await this.reserveService.getReserves(companyId, month, year);
  }
  @Get('availability')
  async getAvailability(
    @Company('id') companyId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @Query('variantId') variantId?: string,
  ) {
    return await this.reserveService.getDayAvailability(companyId, moment(date).toDate(), serviceId, variantId);
  }
  @Get(':id')
  async getById(@Company('id') companyId: string, @Param('id') reserveId: string) {
    return await this.reserveService.getReserveById(companyId, reserveId);
  }
  @Post()
  async createReservation(@Company('id') companyId: string, @Body() body: CreateReserveRequestDto) {
    return await this.reserveService.createReserve(companyId, body);
  }
  @Patch(':id')
  async updateReservation(@Company('id') companyId: string, @Param('id') reserveId: string, @Body() body: UpdateReserveRequestDto) {
    return await this.reserveService.updateReserve(companyId, reserveId, body);
  }
  @Patch('date/:id')
  async updateReservationDate(@Company('id') companyId: string, @Param('id') reserveId: string, @Body() body: UpdateReserveDateRequestDto) {
    return await this.reserveService.updateReserveDate(companyId, reserveId, body.date);
  }
  @Delete(':id')
  async deleteReservation(@Company('id') companyId: string, @Param('id') reserveId: string) {
    return await this.reserveService.deleteReserve(companyId, reserveId);
  }
}
