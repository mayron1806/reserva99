import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Company, User, UserCompany } from '@prisma/client';
import { validatePermission } from 'src/Utils/Roles.utils';
import { roles } from 'src/constants/roles';
import { PermissionsDataType, PERMISSIONS_KEY } from 'src/decorators/member-permissions.decorator';

/**
 * @requires JwtGuard
 * @requires CompanyGuard
 */
@Injectable()
export class MemberPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<PermissionsDataType>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) return true;
    
    const { getRequest } = context.switchToHttp();
    const request = getRequest();
    const user = request.user as User;
    const company = request.company as Company & { users: UserCompany[] };
    if (!company) throw new BadRequestException('Erro ao validar permissões.');

    const companyUser = company.users.find(u => u.userId === user.id);
    if (!companyUser) throw new ForbiddenException('O usuario não tem a permissão necessaria.');
    if (!validatePermission(roles[companyUser.role], permission.permission)) {
      throw new ForbiddenException(permission.errorMessage ?? 'O usuario não tem a permissão necessaria.');
    }
    return true;
  }
}
