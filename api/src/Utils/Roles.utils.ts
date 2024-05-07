import { Permissions } from "src/types/permission";

export const validatePermission = (role: Permissions[], requiredPermission: Permissions) => {
  return role.includes(requiredPermission);
}