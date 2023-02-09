import { UnauthorizedException } from '@nestjs/common';
import { AuthMockService } from '../../auth.mock.spec';

import { PermissionsAuthGuard } from './permissions-auth.guard';

describe('Permissions Auth Guard ', () => {
  let permissionsAuthGuard: PermissionsAuthGuard;

  beforeEach(async () => {
    permissionsAuthGuard = new PermissionsAuthGuard();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(permissionsAuthGuard).toBeDefined();
  });

  it('Validamos handleRequest', () => {
    // Validamos el caso OK
    let err: any = false;
    let info;
    let user: any = AuthMockService.user;
    const handleRequestOk = permissionsAuthGuard.handleRequest(err, user, info);
    expect(handleRequestOk).toEqual(user);

    err = false;
    user = false;
    expect(() => {
      permissionsAuthGuard.handleRequest(err, user, info);
    }).toThrow(new UnauthorizedException('No te encuentras autenticado con permisos'));
  });
});
