import { Test, TestingModule } from '@nestjs/testing';
import { AuthMockService } from '../../auth.mock.spec';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from '../jwt/user-role.guard';
import { BadRequestException, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';

describe('User Role Guard ', () => {
  let permissionsGuard: PermissionsGuard;
  let mockService: AuthMockService = new AuthMockService();
  let reflectorMock: Reflector;
  let executionContextMock: any = {
    getHandler: jest.fn(),
    getArgs: jest.fn().mockReturnThis(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn().mockImplementation(() => {
        return { user: AuthMockService.user };
      }),
    })),
  };

  let executionContextMockError: any = {
    getHandler: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn().mockImplementation(() => {
        return { user: undefined };
      }),
    })),
  };

  beforeEach(async () => {
    reflectorMock = new Reflector();
    permissionsGuard = new PermissionsGuard(reflectorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(permissionsGuard).toBeDefined();
  });

  it('validate canActivate', async () => {
    jest.spyOn(executionContextMock, 'getArgs').mockImplementationOnce(() => {
      return [
        {
          user: {
            scope: '',
          },
        },
      ];
    });
    const spyReflectorGet = jest.spyOn(reflectorMock, 'get').mockImplementation(() => {
      return '';
    });
    const canActivate = await permissionsGuard.canActivate(executionContextMock);
    expect(canActivate).toBeTruthy();
    expect(spyReflectorGet).toBeCalled();
  });

  it('validate canActive in case hasPermission is true ' , async () => {
    jest.spyOn(executionContextMock, 'getArgs').mockImplementationOnce(() => {
        return [
          {
            user: {
              scope: 'webhook',
            },
          },
        ];
      });
      const spyReflectorGet = jest.spyOn(reflectorMock, 'get').mockImplementation(() => {
        return ['webhook'];
      });
      const canActivate = await permissionsGuard.canActivate(executionContextMock);
      expect(canActivate).toBeTruthy();
      expect(spyReflectorGet).toBeCalled();

  })
});
