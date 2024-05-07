import { Permissions } from 'src/types/permission';

export const roles = {
  'admin': [
    Permissions.CREATE_RESERVE, Permissions.EDIT_RESERVE, Permissions.READ_RESERVE,
    Permissions.CREATE_SERVICE, Permissions.EDIT_SERVICE, Permissions.READ_SERVICE,
    Permissions.CREATE_TRANSACTION, Permissions.DELETE_TRANSACTION, Permissions.READ_CASH_FLOW,
  ],
  'receptionist': [Permissions.CREATE_RESERVE, Permissions.EDIT_RESERVE, Permissions.READ_RESERVE],
  'counter': [Permissions.READ_CASH_FLOW, Permissions.READ_RESERVE, Permissions.READ_SERVICE],
  'reader': [Permissions.READ_CASH_FLOW, Permissions.READ_RESERVE, Permissions.READ_SERVICE]
}