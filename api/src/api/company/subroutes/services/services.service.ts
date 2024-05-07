import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateServiceRequest } from './dto/create-service';
import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { UpdateServiceRequest } from './dto/update-service';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  async getServices(companyId: string) {
    return await this.txHost.tx.service.findMany({
      where: { companyId },
      include: { variants: true },
    });
  }
  async getServiceList(companyId: string) {
    return await this.txHost.tx.service.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
      }
    });
  }
  async getServiceById(companyId: string, serviceId: string) {
    const service = await this.txHost.tx.service.findUnique({
      where: { id: serviceId },
      include: { variants: true },
    });
    if (service.companyId !== companyId) {
      throw new ForbiddenException('Você não tem permissão para acessar os dados deste serviço');
    }
    return service;
  }
  private async existsServiceWithIdentifier(identifier: string, companyIdentifier: string, ignoreId?: string) {
    const service = await this.txHost.tx.service.findFirst({
      where: { 
        AND: [
          ignoreId ? { id: { not: ignoreId } } : {},
          { identifier },
          { company: { identifier: companyIdentifier }}
        ]
      }
    });
    return !!service;
  }
  async createService(companyId: string, companyIdentifier: string, body: CreateServiceRequest) {
    if (body.containVariants && body.variants?.length == 0) {
      throw new BadRequestException('É necessário informar as variantes do seu serviço');
    }
    if (body.identifier && await this.existsServiceWithIdentifier(body.identifier, companyIdentifier)) {
      throw new BadRequestException('O identificador já está em uso.');
    }
    const newService = await this.txHost.tx.service.create({
      data: {
        name: body.name,
        description: body.description,
        identifier: body.identifier,
        containVariants: body.containVariants,
        company: { connect: { id: companyId } },
        duration: body.duration,
        price: body.price,
        allowClientAnonymousReserve: body.allowClientAnonymousReserve,
        allowClientReserve: body.allowClientReserve,
        variants: !body.containVariants ? undefined : {
          create: body.variants.map(v => ({ 
            name: v.name,
            description: v.description,
            duration: v.duration,
            price: v.price,
          })),
        },
      },
      include: { variants: true }
    });
    return newService;
  }
  @Transactional()
  async updateService(companyId: string, companyIdentifier: string, serviceId: string, body: UpdateServiceRequest) {
    if (body.containVariants && body.variants?.length == 0) {
      throw new BadRequestException('É necessário informar as variantes do seu serviço');
    }
    if (body.identifier && await this.existsServiceWithIdentifier(body.identifier, companyIdentifier, serviceId)) {
      throw new BadRequestException('O identificador já está em uso.');
    }
    const service = await this.txHost.tx.service.findUnique({ where: { id: serviceId } });
    if(!service) throw new NotFoundException('Serviço não encontrado');
    if (service.companyId !== companyId) {
      throw new ForbiddenException('Você não tem permissão para editar esse serviço');
    }
    // remove variantes não usados
    try {
      const variantMantainIdList = body.variants.filter(v => v.id && v.id.length > 0).map(v => v.id);
      const variants = await this.txHost.tx.variant.findMany({ where: { serviceId }});
      const variantsToRemove = variants.filter(v => !variantMantainIdList.includes(v.id));    
      await Promise.all(
        variantsToRemove.map(async v => {
          try {
            return await this.removeServiceVariant(v.id);
          } catch (error) {
            throw error;
          }
        })
      );
    } catch (error) {
      throw error;
    }

    const updatedService = await this.txHost.tx.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name: body.name ?? service.name,
        description: body.description ?? service.description,
        identifier: body.identifier ?? service.identifier,
        containVariants: body.containVariants ?? service.containVariants,
        company: { connect: { id: companyId } },
        duration: body.duration ?? service.duration,
        price: body.price ?? service.price,
        allowClientAnonymousReserve: body.allowClientAnonymousReserve ?? service.allowClientAnonymousReserve,
        allowClientReserve: body.allowClientReserve ?? service.allowClientReserve,
        variants: {
          upsert: body.variants.map(({id, ...variant}) => ({
            where: { id },
            create: variant,
            update: variant
          }))
        }
      },
      include: { variants: true }
    });
    return updatedService;
  }
  async removeServiceVariant(id: string) {
    const variant = await this.txHost.tx.variant.findUnique({ where: { id, reserves: { some: { status: { not: 'completed' } } } }});
    if (variant) {
      throw new BadRequestException(`A variação ${variant.name} ainda tem agendamentos pendentes.`);
    }
    await this.txHost.tx.variant.delete({ where: { id }});
    return true;
  }
  @Transactional()
  async deleteService(serviceId: string, companyId: string) {
    const service = await this.txHost.tx.service.findUnique({ where: { id: serviceId, companyId }, include: { variants: true } });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado, ou você não tem acesso a ele.');
    }
    // verificar se tem variações, se tiver deletar todas e depois o servico
    if (service.containVariants) {
      try {
        await Promise.all(service.variants.map(async v => {
          try {
            return await this.removeServiceVariant(v.id);
          } catch (error) {
            throw error;
          }
        }))
      } catch (error) {
        throw error;
      }
      return await this.txHost.tx.service.delete({ where: { id: serviceId } });
      
    }
    // se não deve buscas os agendamentos e verificar se tem algum pendente
    const serviceWithPendingReserve = await this.txHost.tx.service.findUnique({
      where: {
        id: serviceId,
        reserves: { some: { status: { not: 'completed' } } } 
      }
    });
    if (serviceWithPendingReserve) {
      throw new BadRequestException(`O serviço ainda tem agendamentos pendentes.`);
    }
    return await this.txHost.tx.service.delete({ where: { id: serviceId } });
  }
}

