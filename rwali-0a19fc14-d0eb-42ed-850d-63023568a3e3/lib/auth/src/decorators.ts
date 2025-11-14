import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Permission, Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';

export const ROLES_KEY = 'roles';
export const PERMS_KEY = 'perms';
export const ORG_SCOPE_KEY = 'orgScope';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const Permissions = (...perms: Permission[]) => SetMetadata(PERMS_KEY, perms);

// Org scope decorator to require same org (or parent->child) access
export const OrgScoped = () => SetMetadata(ORG_SCOPE_KEY, true);

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as import('@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data').JwtUser;
});
