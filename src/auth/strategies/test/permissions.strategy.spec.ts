import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user/user.service';
import { AuthMockService } from '../../auth.mock.spec';
import { Permissionstrategy } from '../permissions.strategy';

describe('Permissions Strategy ', () => {
  let permissionsStrategy: Permissionstrategy;
  let userService: UserService;
  let mockService: AuthMockService = new AuthMockService();
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, PassportModule],
      providers: [
        Permissionstrategy,
        {
          provide: ConfigService,
          useValue: mockService,
        },
        {
          provide: UserService,
          useValue: mockService,
        },
        {
          provide: ConfigService,
          useValue: mockService,
        },
      ],
    }).compile();

    permissionsStrategy = module.get<Permissionstrategy>(Permissionstrategy);
    userService = module.get<UserService>(UserService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(permissionsStrategy).toBeDefined();
  });

  it('fuction validate shoud be return payload ', async () => {
    const awesomeValidateMock = { validate: 'OK' };
    const data = await permissionsStrategy.validate(awesomeValidateMock);
    expect(data).toBeDefined();
    expect(data).toEqual(awesomeValidateMock);
  });
});
