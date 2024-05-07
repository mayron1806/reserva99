import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CompanyGuard } from 'src/guard/company.guard';
import { Company } from 'src/decorators/company.decorator';
import { CreateServiceRequest } from './dto/create-service';
import { Company as CompanyEntity } from '@prisma/client';
import { UpdateServiceRequest } from './dto/update-service';
import { Public } from 'src/decorators/public.decorator';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get()
  async getServices(@Company('id') companyId: string) {
    return await this.servicesService.getServices(companyId);
  }
  @Get('list')
  @Public()
  async getServiceList(@Company('id') companyId: string) {
    return await this.servicesService.getServiceList(companyId);
  }
  @Get(':id')
  @Public()
  async getServiceById(@Company('id') companyId: string, @Param('id') id: string) {
    return await this.servicesService.getServiceById(companyId, id);
  }
  @Post()
  async createService(@Company() company: CompanyEntity, @Body() body: CreateServiceRequest) {
    return await this.servicesService.createService(company.id, company.identifier, body);
  }
  @Put(':id')
  async updateService(@Param('id') id: string, @Company() company: CompanyEntity, @Body() body: UpdateServiceRequest) {
    return await this.servicesService.updateService(company.id, company.identifier, id, body);
  }
  @Delete(':id')
  async deleteService(@Param('id') id: string, @Company('id') companyId: string) {
    return await this.servicesService.deleteService(id, companyId);
  }
}
/**
 * listar servicos
 * pegar qtd reservas do servico
 * criar servico - 
 * atualizar
 * deletar
 */