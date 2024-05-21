import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CompanyService } from './company.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { JwtGuard } from 'src/guard/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { StorageService } from 'src/modules/storage/storage.service';
import { CreateCompanyRequestDto, CreateCompanyResponseDto } from './dto/create-company';
import { CompanyGuard } from 'src/guard/company.guard';
import { Company } from 'src/decorators/company.decorator';
import { UpdateCompanyRequestDto } from './dto/update-company';

@Controller('company')
@UseGuards(JwtGuard)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly storageService: StorageService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
  ) {}
  
  @Get()
  async getByUser(@User('id') userId: string) {
    const companies = await this.txHost.tx.company.findMany({
      where: { 
        users: {
          some: { 
            userId
          },
        },
      },
    });
    return companies;
  }
  @UseGuards(CompanyGuard)
  @Get(':companyIdentifier')
  async getByIdentifier(
    @Company("id") companyId: string,
  ) {
    const company = await this.txHost.tx.company.findUnique({
      where: { 
        id: companyId
      },
      include: { address: true }
    });
    return CreateCompanyResponseDto.mapToResponse(company);
  }
  
  @Post()
  async createCompany(
    @Body() body: CreateCompanyRequestDto,
    @User('id') userId: string
  ) {
    return await this.companyService.createCompany(body, userId);
  }

  @UseGuards(CompanyGuard)
  @Put(':companyIdentifier')
  async updateCompany(
    @Company("id") companyId: string,
    @Body() body: UpdateCompanyRequestDto,
  ) {
    const data = await this.companyService.updateCompany(companyId, body);
    return data;
  }
  
  @UseGuards(CompanyGuard)
  @Patch(':companyIdentifier/photo')
  async setCompanyPhoto(
    @Company("id") companyId: string,
  ) {
    return await this.companyService.setCompanyPhoto(companyId, 'png');
  }
}
