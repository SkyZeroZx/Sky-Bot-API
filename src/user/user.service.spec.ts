import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth0Service, AwsS3Service } from '@core/services';
import { User } from './entities/user.entity';
import { UserServiceMock } from './user.mock.spec';
import { UserService } from './user.service';
import { transporter } from '@core/config';
import { AuthMockService } from '../auth/auth.mock.spec';
import { MAIL_CREATE_USER, MSG_OK } from '@core/constants';
import generatePassword from 'generate-password';
import * as helpers from '@core/helpers';

describe('UserService', () => {
  let userService: UserService;
  let awsS3Service: AwsS3Service;
  let auth0Service: Auth0Service;
  let auth0ServiceMock = new AuthMockService();
  let mockService: UserServiceMock = new UserServiceMock();
  const userAdmin: User = UserServiceMock.userAdmin;
  const createUserDto = UserServiceMock.mockCreateDto;
  const updateUserDto = UserServiceMock.updateUser;
  const mockPassword = 'ABSDFSDFDS12312@';
  const userId = 123;
  const user_id = '123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockService,
        },
        {
          provide: AwsS3Service,
          useValue: mockService,
        },
        {
          provide: Auth0Service,
          useValue: auth0ServiceMock,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    auth0Service = module.get<Auth0Service>(Auth0Service);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('validate createUser email previous exist', async () => {
    const spyFindUserByEmail = jest
      .spyOn(userService, 'findUserByEmail')
      .mockResolvedValueOnce({ message: 'email already' });
    await expect(userService.create(createUserDto)).rejects.toThrowError(
      new BadRequestException('El correo del usuario ya existe'),
    );

    expect(spyFindUserByEmail).toBeCalledWith(createUserDto.username);
  });

  it('validate createUser Ok', async () => {
    const spyGeneratePassword = jest
      .spyOn(generatePassword, 'generate')
      .mockReturnValueOnce(mockPassword);
    const user = UserServiceMock.userMock;
    const spyFindUserByEmail = jest
      .spyOn(userService, 'findUserByEmail')
      .mockResolvedValueOnce(UserServiceMock.mockResultOk);
    const spySave = jest.spyOn(mockService, 'save').mockResolvedValueOnce(UserServiceMock.userMock);
    const spyCreateUser = jest
      .spyOn(auth0ServiceMock.management, 'createUser')
      .mockImplementation(async () => {
        return null;
      });
    const spySendEmail = jest.spyOn(transporter, 'sendMail').mockResolvedValueOnce(null);
    const { message } = await userService.create(createUserDto);
    expect(spySave).toBeCalledWith(createUserDto);
    expect(spyCreateUser).toBeCalled();
    expect(spySendEmail).toBeCalledWith({
      from: 'Sky Bot',
      to: user.username,
      subject: 'Creacion de nuevo usuario Sky Bot',
      html: MAIL_CREATE_USER(user.username, mockPassword),
    });
    expect(message).toEqual(MSG_OK);
    expect(spyGeneratePassword).toBeCalled();
    expect(spyFindUserByEmail).toBeCalledWith(createUserDto.username);
  });

  it('validate createUser error in create user in database', async () => {
    const spyFindUserByEmail = jest
      .spyOn(userService, 'findUserByEmail')
      .mockResolvedValueOnce(UserServiceMock.mockResultOk);
    const spySave = jest.spyOn(mockService, 'save').mockRejectedValueOnce(new Error());
    await expect(userService.create(createUserDto)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al crear al usuario'),
    );
    expect(spySave).toBeCalled();
    expect(spyFindUserByEmail).toBeCalled();
  });

  it('validate createUser error in send mail', async () => {
    const spyFindUserByEmail = jest
      .spyOn(userService, 'findUserByEmail')
      .mockResolvedValueOnce(UserServiceMock.mockResultOk);
    const spySave = jest.spyOn(mockService, 'save').mockResolvedValueOnce(UserServiceMock.userMock);
    const spySendEmail = jest.spyOn(transporter, 'sendMail').mockRejectedValueOnce(new Error());
    await expect(userService.create(createUserDto)).rejects.toThrowError(
      new InternalServerErrorException('Hubo un error al enviar el correo de creacion'),
    );
    expect(spySendEmail).toBeCalled();
    expect(spyFindUserByEmail).toBeCalled();
    expect(spySave).toBeCalled();
  });

  it('Validate getUserById Ok', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockResolvedValueOnce(UserServiceMock.userMock);
    const user = await userService.getUserById(userId);
    expect(spyFindOneOrFail).toBeCalledWith({
      where: { id: userId },
    });
    expect(user).toEqual(UserServiceMock.userMock);
  });

  it('Validate getUserById Error', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());
    await expect(userService.getUserById(userId)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al buscar el usuario'),
    );
    expect(spyFindOneOrFail).toBeCalled();
  });

  it('validate delete ok ', async () => {
    const spyGetUsersByEmail = jest
      .spyOn(auth0ServiceMock.management, 'getUsersByEmail')
      .mockImplementationOnce(() => {
        return [
          {
            user_id,
          },
        ];
      });
    const spyDeleteUserAuth0 = jest
      .spyOn(auth0ServiceMock.management, 'deleteUser')
      .mockImplementationOnce(() => {
        return null;
      });
    const spyRemove = jest.spyOn(mockService, 'delete').mockResolvedValueOnce(null);
    const { message } = await userService.remove(UserServiceMock.deleteUserDto);
    expect(spyRemove).toBeCalled();
    expect(spyGetUsersByEmail).toBeCalled();
    expect(message).toEqual(MSG_OK);
    expect(spyDeleteUserAuth0).toBeCalled();
  });

  it('validate delete error', async () => {
    const spyGetUsersByEmail = jest
      .spyOn(auth0ServiceMock.management, 'getUsersByEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(userService.remove(UserServiceMock.deleteUserDto)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al eliminar al usuario'),
    );
    expect(spyGetUsersByEmail).toBeCalled();
  });

  it('validate update ok ', async () => {
    const spyCreate = jest.spyOn(mockService, 'create').mockReturnValueOnce(userAdmin);
    const spyUpdate = jest.spyOn(mockService, 'update').mockResolvedValueOnce(null);
    const spyGetUsersByEmail = jest
      .spyOn(auth0ServiceMock.management, 'getUsersByEmail')
      .mockImplementationOnce(() => {
        return [
          {
            user_id,
          },
        ];
      });
    const spyUpdateUserAuth0 = jest
      .spyOn(auth0ServiceMock.management, 'updateUser')
      .mockImplementationOnce(() => {
        return null;
      });
    const { message } = await userService.update(updateUserDto, userAdmin);
    expect(spyUpdate).toBeCalled();
    expect(spyCreate).toBeCalled();
    expect(spyGetUsersByEmail).toBeCalled();
    expect(spyUpdateUserAuth0).toBeCalled();
    expect(message).toEqual(MSG_OK);
  });

  it('validate update error user not valid role for update data', async () => {
    const userNotValidRole = UserServiceMock.userNotValidRole;
    const spyCreate = jest.spyOn(mockService, 'create').mockReturnValueOnce(userNotValidRole);
    await expect(userService.update(updateUserDto, userNotValidRole)).rejects.toThrowError(
      new ForbiddenException('User not allowed to update role'),
    );
    expect(spyCreate).not.toBeCalled();
  });

  it('validate update error when update in database', async () => {
    const spyCreate = jest.spyOn(mockService, 'create').mockReturnValueOnce(userAdmin);
    const spyUpdate = jest.spyOn(mockService, 'update').mockRejectedValueOnce(new Error());

    await expect(userService.update(updateUserDto, userAdmin)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al actualizar al usuario'),
    );
    expect(spyUpdate).toBeCalled();
    expect(spyCreate).toBeCalled();
  });

  it('validate update error when update user in auth0', async () => {
    const spyCreate = jest.spyOn(mockService, 'create').mockReturnValueOnce(userAdmin);
    const spyUpdate = jest.spyOn(mockService, 'update').mockResolvedValueOnce(null);
    const spyGetUsersByEmail = jest
      .spyOn(auth0ServiceMock.management, 'getUsersByEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(userService.update(updateUserDto, userAdmin)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al actualizar el usuario en Auth0'),
    );
    expect(spyUpdate).toBeCalled();
    expect(spyCreate).toBeCalled();
    expect(spyGetUsersByEmail).toBeCalled();
  });

  it('Validate savePhotoUser Ok', async () => {
    const spyFileNamer = jest.spyOn(helpers, 'fileNamer').mockReturnValueOnce(null);
    const spyUploadFile = jest
      .spyOn(awsS3Service, 'uploadFile')
      .mockResolvedValueOnce({ Location: 'www.awsS3.com/skyzerozx.jpg' });
    const spyUpdate = jest.spyOn(mockService, 'update');
    await userService.savePhotoUser(UserServiceMock.mockFile, UserServiceMock.userMock);
    expect(spyUploadFile).toBeCalledWith(UserServiceMock.mockFile.buffer, null);
    expect(spyFileNamer).toBeCalledWith(
      UserServiceMock.mockFile,
      UserServiceMock.userMock.username,
    );
    expect(spyUpdate).toBeCalledWith(
      { id: UserServiceMock.userMock.id },
      { photo: 'www.awsS3.com/skyzerozx.jpg' },
    );
  });

  it('Validate savePhotoUser Error', async () => {
    await expect(
      userService.savePhotoUser(UserServiceMock.mockFile, UserServiceMock.userMock),
    ).rejects.toThrowError(new InternalServerErrorException('Sucedio un error al subir su foto'));
  });

  it('Validate getStudents ', async () => {
    const spyCreateQueryBuilder = jest.spyOn(mockService, 'createQueryBuilder');
    const spyWhere = jest.spyOn(mockService, 'where');
    const spyOrderBy = jest.spyOn(mockService, 'orderBy');
    const spyOffset = jest.spyOn(mockService, 'offset');
    const spyLimit = jest.spyOn(mockService, 'limit');
    const spyGetRawMany = jest.spyOn(mockService, 'getRawMany');
    const spyGetCount = jest.spyOn(mockService, 'getCount');
    const spyAndWhere = jest.spyOn(mockService, 'andWhere');
    const spyGetRawAndEntities = jest.spyOn(mockService, 'getRawMany');

    await userService.getUsers(UserServiceMock.pageOptionsDto);
    expect(spyCreateQueryBuilder).toBeCalledTimes(1);
    expect(spyWhere).toBeCalledTimes(1);
    expect(spyOrderBy).toBeCalledTimes(1);
    expect(spyOffset).toBeCalledTimes(1);
    expect(spyLimit).toBeCalledTimes(1);
    expect(spyGetRawMany).toBeCalledTimes(1);
    expect(spyGetCount).toBeCalledTimes(1);
    expect(spyAndWhere).toBeCalled();
    expect(spyGetRawAndEntities).toBeCalledTimes(1);
  });

  it('validate findUserByEmail ok', async () => {
    const spyFindOneBy = jest.spyOn(mockService, 'findOneBy').mockResolvedValueOnce(null);
    const { message } = await userService.findUserByEmail(UserServiceMock.email);
    expect(spyFindOneBy).toBeCalled();
    expect(message).toEqual(MSG_OK);
  });

  it('validate findUserByEmail with return user', async () => {
    const spyFindOneBy = jest.spyOn(mockService, 'findOneBy').mockResolvedValueOnce(UserServiceMock.userMock);
    const {message , user} = await userService.findUserByEmail(UserServiceMock.email);
    expect(spyFindOneBy).toBeCalled();
    expect(message).not.toEqual(MSG_OK);
    expect(user).toEqual(UserServiceMock.userMock)
  })

  it('validate findUserByEmail Error', async () => {
    const spyFindOneBy = jest.spyOn(mockService, 'findOneBy').mockRejectedValueOnce(new Error());
    await expect(userService.findUserByEmail(UserServiceMock.email)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al buscar al usuario'),
    );
    expect(spyFindOneBy).toBeCalled();
  });
});
