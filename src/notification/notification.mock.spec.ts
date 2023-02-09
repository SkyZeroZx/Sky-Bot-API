import { STATUS_USER } from '../core/constants';
import { User } from '../user/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

export class NotificationMockService {
  public save = jest.fn().mockReturnThis();

  public delete = jest.fn().mockReturnThis();
  public createQueryBuilder = jest.fn(() => ({
    where: this.where,
    select: this.select,
    innerJoin: this.innerJoin,
    getRawMany: this.getRawMany,
    execute: this.execute,
  }));

  public saveTaskToUser = jest.fn().mockReturnThis();
  public findAndCount = jest.fn().mockReturnThis();
  public removeUserToTask = jest.fn().mockReturnThis();
  public where = jest.fn().mockReturnThis();
  public select = jest.fn().mockReturnThis();
  public execute = jest.fn().mockReturnThis();
  public getRawMany = jest.fn().mockReturnThis();
  public innerJoin = jest.fn().mockReturnThis();

  public static codSchedule: number = 1;

  public static readonly createNotificationDto: CreateNotificationDto = {
    tokenPush: 'TokenPush25',
  };

  public static readonly sendNotificationDto: SendNotificationDto = {
    users: [],
  };

  public static readonly mockFindAllUserData: User[] = [
    {
      id: 1,
      username: 'SkyZeroZx',
      name: 'Jaime',
      motherLastName: 'Burgos',
      fatherLastName: 'Tejada',
      role: 'Admin',
      createdAt: new Date(),
      updateAt: new Date(),
      dni: '12312312',
      status: STATUS_USER.CREATE,
      firstLogin: false,
      phone: null,
      photo: null,
    },
    {
      id: 2,
      username: 'Test User 2',
      name: 'User',
      dni: '12312312',
      status: STATUS_USER.CREATE,
      firstLogin: false,
      motherLastName: 'User Materno 2',
      fatherLastName: 'Paterno 2',
      role: 'employee',
      createdAt: new Date(),
      updateAt: new Date(),
      phone: null,
      photo: null,
    },
  ];

  public static readonly tokenByUser: any[] = [
    { tokePush: 'Token1' },
    { tokePush: 'Token2' },
    { tokePush: 'Token3' },
  ];
}
