import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserServiceMock } from './user.mock.spec';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let mockService: UserServiceMock = new UserServiceMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('validate create', async () => {
    const spyCreate = jest.spyOn(userService, 'create');
    await userController.create(UserServiceMock.mockCreateDto);
    expect(spyCreate).toBeCalled();
  });

  it('validate getUsers', async () => {
    const spyGetUsers = jest.spyOn(userService, 'getUsers');
    await userController.getUsers(UserServiceMock.pageOptionsDto);
    expect(spyGetUsers).toBeCalled();
  });

  it('validate profile', async () => {
    const spyProfile = jest.spyOn(userService, 'getUserById');
    await userController.profile(UserServiceMock.userMock);
    expect(spyProfile).toBeCalled();
  });

  it('validate update', async () => {
    const spyUpdate = jest.spyOn(userService, 'update');
    await userController.update(UserServiceMock.userMock, UserServiceMock.userMock);
    expect(spyUpdate).toBeCalled();
  });

  it('validate remove', async () => {
    const spyRemove = jest.spyOn(userService, 'remove');
    await userController.remove(UserServiceMock.deleteUserDto);
    expect(spyRemove).toBeCalled();
  });

  it('Validate SavePhotoUser', async () => {
    const spySavePhotoUser = jest.spyOn(userService, 'savePhotoUser');
    await userController.savePhotoUser(UserServiceMock.fileMock as any, UserServiceMock.userMock);

    expect(spySavePhotoUser).toBeCalledWith(UserServiceMock.fileMock, UserServiceMock.userMock);
  });
});
