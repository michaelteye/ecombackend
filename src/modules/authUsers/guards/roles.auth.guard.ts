import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthUserRole } from '../types/auth-user.roles';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRequestContext } from '../utils/app.request';
import { getAppContextALS } from '../utils/context';

export const ROLES_KEY = 'allowedRoles';
export const AuthRoles = (...roles: AuthUserRole[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.get<AuthUserRole[]>(ROLES_KEY, context.getHandler());

      if (!requiredRoles || requiredRoles.length === 0) {
        throw new HttpException('Unauthorized', 401);
      }
      
      const { user } = context.switchToHttp().getRequest();
      console.log('the user is given as >>>', user);
      
      if (requiredRoles.some((role) => user.roles?.includes(role))) {
        return true;
      }
      
      throw new HttpException('you are not authorized to create category', 401);
    } catch (error) {
      throw new HttpException('you are not authorized to create category', 401);
    }
  }
}
