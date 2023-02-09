import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions: string[] = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const userPermissions: string = context.getArgs()[0].user.scope;

    if (!routePermissions) {
      return true;
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) => userPermissions.includes(routePermission));

    return hasPermission();
  }
}
