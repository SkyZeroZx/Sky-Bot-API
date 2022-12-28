import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, UserDecorator as User } from '@core/decorators';
import { User as UserEntity } from '../user/entities/user.entity';
import { SendNotificationDto } from './dto/send-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponse } from '@core/swagger/response';
import { ALL_ROLES } from '@core/config';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notificacion')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Registra el token del usuario logeado' })
  @ApiBody(NotificationResponse.bodySaveToken)
  @ApiResponse(NotificationResponse.genericReponse)
  async registerSuscriptionNotification(
    @User() user: UserEntity,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    this.logger.log(`Guardando Token para el usuario logeado ${user.username}`);
    return this.notificationService.suscribeNotification(user.id, createNotificationDto);
  }

  @Auth(['admin'])
  @Post('/send')
  @ApiOperation({ summary: 'Envio de notificacion push a los usuarios asignados a la nueva tarea' })
  @ApiResponse(NotificationResponse.genericReponse)
  async registerTaskTokenByUser(@Body() sendNotificationDto: SendNotificationDto) {
    this.logger.log(`Enviando notificaciones de nueva tarea creada a los usuarios `);
    return this.notificationService.registerTaskTokenByUser(sendNotificationDto.users);
  }
}
