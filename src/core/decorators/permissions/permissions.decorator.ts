import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsAuthGuard } from '../../../auth/guards/permissions/permissions-auth.guard';
import { PermissionsGuard } from '../../../auth/guards/permissions/permissions.guard';
import { Permissions } from './permissions-metadata.decorator';

export function PermissionsDecorator(permissions: string[]) {
  return applyDecorators(
    Permissions(permissions),
    UseGuards(PermissionsAuthGuard),
    UseGuards(PermissionsGuard),
  );
}
