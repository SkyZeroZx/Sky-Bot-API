import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../../user/entities/user.entity';

export const META_ROLES = 'role';

@Injectable()
export class UserRoleGuard implements CanActivate {
  private readonly logger = new Logger(UserRoleGuard.name);
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    if (!validRoles) return true;
    const req = context.switchToHttp().getRequest();

    const user = req.user as User;
    if (!user) throw new BadRequestException('User not found');
    if (validRoles.indexOf(user.role) !== -1) {
      return true;
    }
    this.logger.warn(`User ${user.username} need a valid role: [${validRoles}]`);
    throw new ForbiddenException(`User ${user.username} need a valid role: [${validRoles}]`);
  }
}
