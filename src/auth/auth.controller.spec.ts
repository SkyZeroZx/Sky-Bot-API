import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthMockService } from './auth.mock.spec';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockService: AuthMockService = new AuthMockService();
  const userResetPasswordDto = AuthMockService.userResetPasswordDto;
  const user = AuthMockService.user;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('validate resetPassword ', async () => {
    const spyResetPassword = jest.spyOn(mockService, 'resetPassword');
    await authController.resetPassword(userResetPasswordDto);
    expect(spyResetPassword).toBeCalledWith(userResetPasswordDto.username);
  });

  it('Validate changePassword ', async () => {
    const spyResetPassword = jest.spyOn(mockService, 'resetPassword');
    await authController.changePassword(user);
    expect(spyResetPassword).toBeCalledWith(user.username);
  });
});
