import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import * as webpush from 'web-push';
import { MSG_OK, NOTIFICATION_NEW_TASK } from '@core/constants';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    @InjectRepository(Notification)
    private readonly notificationService: Repository<Notification>,
  ) {}

  async suscribeNotification(codUser: number, createNotificationDto: CreateNotificationDto) {
    this.logger.log({ message: 'Suscribiendo el token para el usuario', createNotificationDto });
    try {
      const [, count] = await this.notificationService.findAndCount({
        where: {
          codUser: codUser,
          tokenPush: createNotificationDto.tokenPush,
        },
      });

      if (count == 0) {
        await this.notificationService.save({
          codUser: codUser,
          tokenPush: createNotificationDto.tokenPush,
        });
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al guardar el token`, error);
      throw new InternalServerErrorException('Sucedio un error al guardar el token');
    }

    this.logger.log(`Se guardo el token para el usuario codigo ${codUser}`);
    return { message: MSG_OK, info: 'Se guardo el token exitosamente' };
  }

  async sendNotification(tokenPush: string, message: Object) {
    this.logger.log({ message: 'Envio Notificacion al token  el valor es', tokenPush });
    webpush
      .sendNotification(JSON.parse(tokenPush), JSON.stringify(message))
      .then((res) => {
        this.logger.log({ message: 'Se envio notificacion ', res });
      })
      .catch((err) => {
        this.logger.warn({
          message: `Fallo al enviar notificacion statusCode : ${err.statusCode}`,
          err,
        });
      });
  }

  async findTokensByUser(codUser: number) {
    return this.notificationService
      .createQueryBuilder('NOTIFICATION')
      .select('DISTINCT   (NOTIFICATION.tokenPush)', 'tokenPush')
      .innerJoin(User, 'USER', ' USER.id = NOTIFICATION.codUser')
      .where('USER.id = :id', {
        id: codUser,
      })
      .getRawMany();
  }

  async registerTaskTokenByUser(listUsers: User[]) {
    this.logger.log('Obteniendo Tokens para la nueva tarea creada');
    let tokensPerUser: any[] = [];
    try {
      listUsers.forEach((user) => {
        tokensPerUser.push(this.findTokensByUser(user.id));
      });

      const listTokensPerUser = await Promise.all(tokensPerUser);

      listTokensPerUser.forEach((tokens) => {
        tokens.forEach(({ tokenPush }) => {
          this.sendNotification(tokenPush, NOTIFICATION_NEW_TASK);
        });
      });

      this.logger.log('Notificaciones enviadas exitosamente');
      return {
        message: MSG_OK,
        info: 'Notificaciones enviadas exitosamente',
      };
    } catch (error) {
      this.logger.error('Sucedio un error al registrar tokens para la nueva tarea', error);
      throw new InternalServerErrorException(
        'Sucedio un error al registrar tokens para la nueva tarea',
      );
    }
  }
}
