import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Service } from '@core/services';
import { AuthMockService } from './auth.mock.spec';
import { transporter } from '@core/config';
import { AuthService } from './auth.service';
import { MAIL_RESET_USER, MSG_OK, STATUS_USER } from '@core/constants';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let auth0Service: Auth0Service;
  let mockService = new AuthMockService();
  const username = AuthMockService.username;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: Auth0Service,
          useValue: mockService,
        },
      ],
    }).compile();

    auth0Service = module.get<Auth0Service>(Auth0Service);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validate resetPassword ok', async () => {
    const spyCreatePasswordChangeTicket = jest
      .spyOn(auth0Service.management, 'createPasswordChangeTicket')
      .mockImplementationOnce(async () => {
        return {
          ticket: 'awesome ticket',
        };
      });

    const spyGetUsersByEmail = jest
      .spyOn(auth0Service.management, 'getUsersByEmail')
      .mockImplementationOnce(async () => {
        return [
          {
            user_id: '12312312',
          },
        ];
      });

    const spyUpdateUser = jest
      .spyOn(auth0Service.management, 'updateUser')
      .mockImplementationOnce(() => {
        return null;
      });

    const spySendMail = jest.spyOn(transporter, 'sendMail').mockResolvedValueOnce(null);
    const { message } = await authService.resetPassword(username);
    expect(spyCreatePasswordChangeTicket).toBeCalledWith({
      email: username,
      connection_id: auth0Service.connectionId,
    });

    expect(spyGetUsersByEmail).toBeCalledWith(username);
    expect(spyUpdateUser).toBeCalledWith(
      {
        id: '12312312',
      },
      {
        connection: auth0Service.connection,
        blocked: false,
        user_metadata: {
          status: STATUS_USER.ENABLED,
        },
      },
    );
    expect(spySendMail).toBeCalledWith({
      from: 'Sky Bot <sky-admin@gmail.com>',
      to: username,
      subject: 'Reseteo Contraseña',
      html: MAIL_RESET_USER(username, 'awesome ticket'),
    });
    expect(message).toEqual(MSG_OK);
  });

  it('validate resetPassword error', async () => {
    const spyCreatePasswordChangeTicket = jest
      .spyOn(auth0Service.management, 'createPasswordChangeTicket')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    await expect(authService.resetPassword(username)).rejects.toThrowError(
      new InternalServerErrorException('Hubo un error al enviar el correo de reseteo'),
    );
    expect(spyCreatePasswordChangeTicket).toBeCalled();
  });
});
