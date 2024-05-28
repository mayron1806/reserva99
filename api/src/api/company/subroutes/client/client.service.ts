import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientRequestDto } from './dto/create-client';
import { GetClientListResponseDto } from './dto/get-client-list';
import { UpdateClientRequestDto } from './dto/update-client';

@Injectable()
export class ClientService {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async getClientList(companyId: string, filter?: string) {
    const clients = await this.txHost.tx.client.findMany({
      where: { 
        companyId,
        OR: filter ? [
          { alias: { contains: filter } },
          { email: { contains: filter } },
          { name: { contains: filter } },
          { phone: { contains: filter } },
        ] : undefined,
      }, 
      include: {
        _count: { select: { reserves: true } },
      }
    });
    return GetClientListResponseDto.mapToResponse(clients.map(c => ({...c, reserveCount: c._count.reserves })));
  }
  async getClientById(companyId: string, clientId: string) {
    const client = await this.txHost.tx.client.findUnique({ where: { id: clientId }});
    if (!client || client.companyId !== companyId) {
      throw new ForbiddenException('O cliente não existe, ou você não tem acesso a ele.');
    }
    return client;
  }

  async createClient(companyId: string, body: CreateClientRequestDto) {
    const client = await this.txHost.tx.client.create({
      data: {
        ...body,
        company: {
          connect: { id: companyId },
        },
      },
    });
    return client;
  }
  
  async updateClient(companyId: string, clientId: string, body: UpdateClientRequestDto) {
    const client = await this.getClientById(companyId, clientId);
    const updatedClient = await this.txHost.tx.client.update({
      where: { id: clientId },
      data: {
        name: body.name ?? client.name,
        alias: body.alias ?? client.alias,
        email: body.email ?? client.email,
        phone: body.phone ?? client.phone,
      }
    });
    return updatedClient;
  }
  
  async deleteClient(companyId: string, clientId: string) {
    const client = await this.txHost.tx.client.delete({
      where: { companyId, id: clientId }
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }
    return client;
  }
}