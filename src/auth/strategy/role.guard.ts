import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/database/entities';
import { ANY_ROLE_KEY } from 'src/shared/decors';
import { UserRoleEnum } from 'src/shared/enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const anyRole = this.ref.getAllAndOverride(ANY_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!anyRole) return true;
    const user = context.switchToHttp().getRequest().user as Partial<User>;
    return anyRole.includes(user?.role);
  }
}
