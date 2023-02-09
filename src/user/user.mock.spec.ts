import { MSG_OK, STATUS_USER } from '../core/constants';
import { PageOptionsDto } from '../core/interface/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export class UserServiceMock {
  public async save(_dto: any): Promise<any> {
    return UserServiceMock.userMock;
  }

  public static readonly email: Readonly<string> = 'user@example.com';

  public uploadFile = jest.fn().mockReturnThis();
  public innerJoin = jest.fn().mockReturnThis();
  public findAll = jest.fn().mockReturnThis();
  public getUserById = jest.fn().mockReturnThis();
  public remove = jest.fn().mockReturnThis();
  public savePhotoUser = jest.fn().mockReturnThis();
  public find = jest.fn().mockReturnThis();
  public create = jest.fn().mockReturnThis();
  public findOneOrFail = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  public select = jest.fn().mockReturnThis();
  public cache = jest.fn().mockReturnThis();
  public getRawMany = jest.fn().mockReturnThis();
  // Metodo mockeado de TypeORM createQueryBuilder
  public createQueryBuilder = jest.fn(() => ({
    where: this.where,
    select: this.select,
    addSelect: this.addSelect,
    getOne: this.getOne,
    offset: this.offset,
    limit: this.limit,
    update: this.update,
    set: this.set,
    cache: this.cache,
    execute: this.execute,
    innerJoin: this.innerJoin,
    getRawMany: this.getRawMany,
    orderBy: this.orderBy,
    getCount: this.getCount,
    andWhere: this.andWhere,
  }));

  // Mockeo para funciones del QueryBuilder
  public where = jest.fn().mockReturnThis();
  public andWhere = jest.fn().mockReturnThis();
  public getCount = jest.fn().mockReturnThis();
  public addSelect = jest.fn().mockReturnThis();
  public orderBy = jest.fn().mockReturnThis();
  public getOne = jest.fn().mockReturnThis();
  public offset = jest.fn().mockReturnThis();
  public limit = jest.fn().mockReturnThis();
  public update = jest.fn().mockReturnThis();
  public set = jest.fn().mockReturnThis();
  public execute = jest.fn().mockReturnThis();
  public findUserByEmail = jest.fn().mockReturnThis();
  public findOneBy = jest.fn().mockReturnThis();
  public getUsers = jest.fn().mockReturnThis();
  public profile = jest.fn().mockReturnThis();

  // Mockeo de objetos
  public static readonly pageOptionsDto: PageOptionsDto = {
    search: 'awesome serach',
    page: 1,
    optionalSearch: 'awesome search optional',
    skip: 0,
    take: 10,
  };

  public static readonly fileMock = {
    fieldname: ',',
    originalname: 'string',
    encoding: 'string',
    mimetype: 'string',
    size: 23423,
    stream: null,
    destination: 'string',
    filename: 'string',
    path: 'string',
    buffer: [],
  };

  public static readonly mockCreateDto: CreateUserDto = {
    username: 'SkyZeroZx',
    name: 'Jaime',
    motherLastName: 'Burgos',
    fatherLastName: 'Tejada',
    role: 'Admin',

    phone: '',
    dni: '',
  };

  public static readonly userMock: User = {
    id: 1,
    username: 'skyzerozx',
    name: 'Jaime',

    motherLastName: 'Burgos',
    fatherLastName: 'Tejada',
    role: 'Admin',
    status: 'CREADO',
    firstLogin: true,
    createdAt: new Date(),
    updateAt: new Date(),

    photo: '',
    phone: '',
    dni: '',
  };

  public static readonly mockResultOk = {
    message: MSG_OK,
  };

  public static readonly userNotValidRole = {
    id: 0,
    username: 'user_name',
    role: 'not valid role',
    createdAt: new Date(),
    updateAt: new Date(),
    name: 'asdsa',
    fatherLastName: 'asdas',
    motherLastName: 'asdsad',
    status: 'asdsa',
    firstLogin: false,
    photo: 'dasdas',
    phone: 'asdsad',
    dni: '32423432',
  };

  public static readonly userAdmin: User = {
    id: 0,
    username: 'user_name',
    role: 'admin',
    createdAt: new Date(),
    updateAt: new Date(),
    name: 'asdsa',
    fatherLastName: 'asdas',
    motherLastName: 'asdsad',
    status: 'asdsa',
    firstLogin: false,
    photo: 'dasdas',
    phone: 'asdsad',
    dni: '32423432',
  };

  public static readonly updateUser: UpdateUserDto = {
    id: 1,
    username: 'SkyZeroZx',
    name: 'Jaime',
    motherLastName: 'Burgos',
    fatherLastName: 'Tejada',
    role: 'admin_2',
    status: 'CREADO',
  };

  public static readonly mockFile: any = {
    buffer: null,
  };

  public static readonly deleteUserDto: DeleteUserDto = {
    username: 'awesome_delete_user@example.com',
  };

  public static readonly mockFindAllUserData: User[] = [
    {
      id: 1,
      username: 'SkyZeroZx',
      name: 'Jaime',
      dni: '',
      motherLastName: 'Burgos',
      fatherLastName: 'Tejada',
      role: 'Admin',
      createdAt: new Date(),
      updateAt: new Date(),
      status: STATUS_USER.CREATE,
      firstLogin: false,

      phone: null,
      photo: null,
    },
  ];
}
