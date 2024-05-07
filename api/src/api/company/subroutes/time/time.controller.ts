import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { TimeService } from './time.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CompanyGuard } from 'src/guard/company.guard';
import { Company } from 'src/decorators/company.decorator';
import { CreateOrUpdateTimeRequest } from './dto/create-time';
import { Public } from 'src/decorators/public.decorator';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class TimeController {
  constructor(private readonly timeService: TimeService) {}
  
  @Get()
  @Public()
  async getTime(@Company('id') companyId: string) {
    return await this.timeService.getTimeByCompany(companyId);
  }
  @Post()
  async createOrUpdateTime(@Company('id') companyId: string, @Body() body: CreateOrUpdateTimeRequest) {
    return await this.timeService.createOrUpdateTime(companyId, body);
  }
}
