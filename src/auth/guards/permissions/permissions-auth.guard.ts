import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PermissionsAuthGuard extends AuthGuard('permissions') {
  handleRequest(err, user, _info) {
    if (err || !user) {
      throw err || new UnauthorizedException('No te encuentras autenticado con permisos');
    }
    return user;
  }
}
