import { ManagementClient } from 'auth0';
import { STATUS_USER } from '../core/constants';
import { User } from '../user/entities/user.entity';
import { UserResetPasswordDto } from './dtos/user-reset-password.dto';

export class AuthMockService {
  public readonly connectionId = 'auth0';
  public createPasswordChangeTicket = jest.fn().mockReturnThis();
  public getUsersByEmail = jest.fn().mockReturnThis();
  public updateUser = jest.fn().mockReturnThis();
  public resetPassword = jest.fn().mockReturnThis();
  public createUser = jest.fn().mockReturnThis();
  public deleteUser = jest.fn().mockReturnThis();
  public get = jest.fn().mockReturnThis();

  public management = {
    createPasswordChangeTicket: this.createPasswordChangeTicket,
    getUsersByEmail: this.getUsersByEmail,
    updateUser: this.updateUser,
    deleteUser: this.deleteUser,
    createUser: this.createUser,
  } as unknown as ManagementClient;

  public getUserById = jest.fn().mockReturnThis();
  public static readonly username: string = 'awesome_user@example.com';

  public static readonly userResetPasswordDto: UserResetPasswordDto = {
    username: this.username,
  };
  public static readonly user: User = {
    id: 1,
    username: 'awesome_user@example.com',
    role: 'awesome_user',
    createdAt: new Date('12-12-1999'),
    updateAt: new Date('02-25-2005'),
    name: 'awesome_name',
    fatherLastName: 'awesome_father',
    motherLastName: 'awesome_mother',
    status: STATUS_USER.ENABLED,
    firstLogin: false,
    photo: 'awesome_photo',
    phone: 'awesome_phone',
    dni: 'awesome_dni',
  };

  public static readonly userBlocked: User = {
    id: 1,
    username: 'awesome_user@example.com',
    role: 'awesome_user',
    createdAt: new Date('12-12-1999'),
    updateAt: new Date('02-25-2005'),
    name: 'awesome_name',
    fatherLastName: 'awesome_father',
    motherLastName: 'awesome_mother',
    status: STATUS_USER.BLOCKED,
    firstLogin: false,
    photo: 'awesome_photo',
    phone: 'awesome_phone',
    dni: 'awesome_dni',
  };

  public static readonly userCreate: User = {
    id: 1,
    username: 'awesome_user@example.com',
    role: 'awesome_user',
    createdAt: new Date('12-12-1999'),
    updateAt: new Date('02-25-2005'),
    name: 'awesome_name',
    fatherLastName: 'awesome_father',
    motherLastName: 'awesome_mother',
    status: STATUS_USER.CREATE,
    firstLogin: false,
    photo: 'awesome_photo',
    phone: 'awesome_phone',
    dni: 'awesome_dni',
  };

  public static readonly userReset: User = {
    id: 1,
    username: 'awesome_user@example.com',
    role: 'awesome_user',
    createdAt: new Date('12-12-1999'),
    updateAt: new Date('02-25-2005'),
    name: 'awesome_name',
    fatherLastName: 'awesome_father',
    motherLastName: 'awesome_mother',
    status: STATUS_USER.RESET,
    firstLogin: false,
    photo: 'awesome_photo',
    phone: 'awesome_phone',
    dni: 'awesome_dni',
  };
}
