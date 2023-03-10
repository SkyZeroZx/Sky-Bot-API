import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt/jwt-auth.guard';
import { UserRoleGuard } from '../../../auth/guards/jwt/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(role: string[]) {
  return applyDecorators(RoleProtected(role), UseGuards(JwtAuthGuard), UseGuards(UserRoleGuard));
}
