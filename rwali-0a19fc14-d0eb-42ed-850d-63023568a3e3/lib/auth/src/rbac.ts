import { Permission, Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';

export const ROLE_INHERITS: Record<Role, Role[]> = {
  [Role.Viewer]: [Role.Viewer],
  [Role.Admin]:  [Role.Admin, Role.Viewer],
  [Role.Owner]:  [Role.Owner, Role.Admin, Role.Viewer],
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Viewer]: [Permission.TASK_READ],
  [Role.Admin]: [
    Permission.TASK_READ,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.AUDIT_READ,
  ],
  [Role.Owner]: [
    Permission.TASK_READ,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.AUDIT_READ,
  ],
};

export function roleHasPermission(role: Role, perm: Permission) {
  for (const r of ROLE_INHERITS[role]) {
    if (ROLE_PERMISSIONS[r].includes(perm)) return true;
  }
  return false;
}
