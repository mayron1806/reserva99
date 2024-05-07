import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Company, User, UserCompany } from '@prisma/client';
import { Reflector } from '@nestjs/core';

/**
 * @description Pega o id do projeto no parametro da url e verifica se 
 * usuario tem acesso a compania
 * @requires JwtGuard
 */
@Injectable()
export class CompanyGuard implements CanActivate {
  private readonly logger = new Logger(CompanyGuard.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly reflector: Reflector
  ) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { getRequest } = context.switchToHttp();
    const request = getRequest();
    const companyIdentifier = request.params.companyIdentifier;
    let company = await this.cacheManager.get<Company & { users: UserCompany[] }>(`company_${companyIdentifier}`);
    if (!company) {
      company = await this.txHost.tx.company.findUnique({ where: { identifier: companyIdentifier }, include: { users: true } });
      this.cacheManager.set(`company_${companyIdentifier}`, company, 60);
      this.logger.debug('companhia salva no cache');
    }
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    // se não for uma rota publica vai verificar se o usuario tem permissão para acessar os a companhia
    if (!isPublic) {
      const user = request.user as User;
      if (!company || company.users.every(u => u.userId !== user.id)) {
        console.log('not found');
        
        throw new NotFoundException(`Companhia com identificador ${companyIdentifier} não encontrado ou você não tem acesso a ele.`);
      }
    }
    request.company = company;
    return true;
  }
}
