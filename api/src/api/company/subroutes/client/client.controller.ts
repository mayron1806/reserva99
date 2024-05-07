import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CompanyGuard } from 'src/guard/company.guard';
import { Company } from 'src/decorators/company.decorator';
import { CreateClientRequestDto } from './dto/create-client';
import { UpdateClientRequestDto } from './dto/update-client';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Get()
  async getList(@Company('id') companyId: string, @Query('filter') filter: string) {
    const data = await this.clientService.getClientList(companyId, filter);
    return data;
  }
  @Get(':id')
  async getById(@Company('id') companyId: string, @Param('id') clientId: string) {
    return await this.clientService.getClientById(companyId, clientId);
  }
  @Post()
  async createClient(@Company('id') companyId: string, @Body() body: CreateClientRequestDto) {
    return await this.clientService.createClient(companyId, body);
  }
  @Patch(':id')
  async updateClient(@Company('id') companyId: string, @Param('id') clientId: string, @Body() body: UpdateClientRequestDto) {
    return await this.clientService.updateClient(companyId, clientId, body);
  }
  @Delete(':id')
  async deleteClient(@Company('id') companyId: string, @Param('id') clientId: string) {
    return await this.clientService.deleteClient(companyId, clientId);
  }
}
