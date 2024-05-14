import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto, CreateCompanyResponseDto } from './dto/create-company';
import { FileUtils } from 'src/Utils/File.utils';
import { StorageService } from 'src/modules/storage/storage.service';
import { UpdateCompanyRequestDto } from './dto/update-company';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly storageService: StorageService,
    ) {}

  async createCompany(body: CreateCompanyRequestDto, userId: string) {
    const companiesByUser = await this.txHost.tx.company.findMany({
      where: {
        users: {
          some: {
            userId,
            role: 'admin'
          },
        },
      },
    });
    if (companiesByUser.length > 0) throw new BadRequestException('Você já possui uma companhia.');
    const companyWithIdentifier = await this.txHost.tx.company.findFirst({ where: { identifier: body.identifier }});
    if (companyWithIdentifier) throw new BadRequestException('O identificador já está em uso');
    const newCompany = await this.txHost.tx.company.create({
      data: {
        name: body.name,
        identifier: body.identifier,
        description: body.description,
        address: body.address ? { 
          create: body.address
        } : undefined,
        gatewaySubscriptionStatus: 'new',
        times: {
          create: {
            monday: body.workTime.monday ? body.workTime.monday as unknown as Prisma.JsonArray : [],
            tuesday: body.workTime.tuesday ? body.workTime.tuesday as unknown as Prisma.JsonArray : [],
            wednesday: body.workTime.wednesday ? body.workTime.wednesday as unknown as Prisma.JsonArray : [],
            thursday: body.workTime.thursday ? body.workTime.thursday as unknown as Prisma.JsonArray : [],
            friday: body.workTime.friday ? body.workTime.friday as unknown as Prisma.JsonArray : [],
            saturday: body.workTime.saturday ? body.workTime.saturday as unknown as Prisma.JsonArray : [],
            sunday: body.workTime.sunday ? body.workTime.sunday as unknown as Prisma.JsonArray : [],
          }
        },
        users: {
          create: {
            userId,
            role: 'admin'
          },
        },
        cashFlow: {
          create: {}
        },
      }
    });
    return CreateCompanyResponseDto.mapToResponse(newCompany);
  }
  async updateCompany(companyId: string, body: UpdateCompanyRequestDto) {
    const companyToUpdate = await this.txHost.tx.company.findUnique({ where: { id: companyId }, include: { address: true } });
    const updatedCompany = await this.txHost.tx.company.update({
      where: { id: companyId },
      data: {
        name: body.name ?? companyToUpdate.name,
        description: body.description ?? companyToUpdate.description,
        address: companyToUpdate.addressId ? { 
          update: body.address ?? companyToUpdate.address,
        } : {
          create: body.address ?? companyToUpdate.address
        },
        cancellationPolicy: body.cancellationPolicy ?? companyToUpdate.cancellationPolicy,
        preCancelTime: body.preCancelTime ?? companyToUpdate.preCancelTime,
        preReserveTime: body.preReserveTime ?? companyToUpdate.preReserveTime,
        maxPreReserveTime: body.maxPreReserveTime ?? companyToUpdate.maxPreReserveTime,
      },
    });
    return CreateCompanyResponseDto.mapToResponse(updatedCompany);
  }
  async setCompanyPhoto(companyId: string, fileExt: string) {
    const uploadProps = FileUtils.getBucketAndPath('company-photo', companyId, fileExt);
    const url = await this.storageService.getUploadUrl(uploadProps);
    return url;
  }
}
