import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { BlockService } from './block.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { Company } from 'src/decorators/company.decorator';
import { CompanyGuard } from 'src/guard/company.guard';
import { CreateOrUpdateBlockRequest } from './dto/create-block';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}
 
  @Get()
  async getBlockByCompanyId(
    @Company('id') companyId: string,
  ) {
    return await this.blockService.getBlockByCompany(companyId);
  }
  
  @Post()
  async createOrUpdateBlock(
    @Company('id') companyId: string,
    @Body() body: CreateOrUpdateBlockRequest,
  ) {
    return await this.blockService.createOrUpdateBlock(companyId, body);
  }
}
