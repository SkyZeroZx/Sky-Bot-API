import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Service } from './auth0.service';

jest.mock('auth0', () => {
  return {
    ManagementClient: jest.fn().mockReturnThis(),
    AuthenticationClient: jest.fn().mockReturnThis(),
  };
});

describe('Auth0Service', () => {
  let auth0Service: Auth0Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auth0Service, ConfigService],
    }).compile();

    auth0Service = module.get<Auth0Service>(Auth0Service);
  });

  it('should be defined', () => {
    expect(auth0Service).toBeDefined();
  });
});
