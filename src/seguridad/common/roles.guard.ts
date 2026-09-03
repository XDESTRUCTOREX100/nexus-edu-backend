import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

type AuthenticatedRequest = Request & {
  user?: { roles?: string[] };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRoles = req.user?.roles ?? [];

    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      throw new ForbiddenException('No tienes permisos para esta operación');
    }

    return true;
  }
}
