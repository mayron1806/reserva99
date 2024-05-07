import { SetMetadata } from '@nestjs/common';
import { Permissions as Roles } from 'src/types/permission';

export type PermissionsDataType = {
  permission: Roles;
  errorMessage?: string;
}

export const PERMISSIONS_KEY = 'MEMBER_PERMISSIONS';
export const MemberPermissions = (data: PermissionsDataType) => SetMetadata(PERMISSIONS_KEY, data);
