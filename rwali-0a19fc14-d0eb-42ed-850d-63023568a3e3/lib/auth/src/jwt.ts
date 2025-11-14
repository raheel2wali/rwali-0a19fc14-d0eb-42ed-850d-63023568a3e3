import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { PERMS_KEY, ROLES_KEY, ORG_SCOPE_KEY } from './decorators';
import { JwtUser, Permission, Role } from '@rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3/data';
import { roleHasPermission } from './rbac';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }
  async validate(payload: JwtUser): Promise<JwtUser> {
    if (!payload?.id) throw new UnauthorizedException();
    return payload;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) throw new UnauthorizedException('No token');
    const token = auth.slice(7);
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user: JwtUser | undefined = req.user;
    if (!user) throw new UnauthorizedException();

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
    const requiredPerms = this.reflector.getAllAndOverride<Permission[]>(PERMS_KEY, [ctx.getHandler(), ctx.getClass()]);
    const orgScoped = this.reflector.getAllAndOverride<boolean>(ORG_SCOPE_KEY, [ctx.getHandler(), ctx.getClass()]);

    if (requiredRoles?.length && !requiredRoles.includes(user.role)) return false;

    if (requiredPerms?.length) {
      for (const p of requiredPerms) if (!roleHasPermission(user.role, p)) return false;
    }

    if (orgScoped) {
      // Enforce org scope: either same org or (owner/admin) on parent that contains child
      // For simplicity, ensure resource resolver sets req.orgIdChecked
      const resourceOrgId = req.orgIdChecked ?? user.orgId;
      if (!resourceOrgId || !user.orgId) return false;
      // Minimal: require equality. (Optional enhancement: allow parent->child via DB tree check)
      if (resourceOrgId !== user.orgId && user.role !== Role.Owner) return false;
    }

    return true;
  }
}
