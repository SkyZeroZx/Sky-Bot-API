import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { transporter } from '@core/config';
import { Auth0Service } from '@core/services';
import { MAIL_RESET_USER, MSG_OK, STATUS_USER } from '@core/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly auth0Service: Auth0Service) {}

  async resetPassword(username: string) {
    try {
      const { ticket } = await this.auth0Service.management.createPasswordChangeTicket({
        email: username,
        connection_id: this.auth0Service.connectionId,
      });

      const [{ user_id }] = await this.auth0Service.management.getUsersByEmail(username);

      await this.auth0Service.management.updateUser(
        {
          id: user_id,
        },
        {
          connection: this.auth0Service.connection,
          blocked: false,
          user_metadata: {
            status: STATUS_USER.ENABLED,
          },
        },
      );

      await transporter.sendMail({
        from: 'Sky Bot <sky-admin@gmail.com>',
        to: username,
        subject: 'Reseteo Contraseña',
        html: MAIL_RESET_USER(username, ticket),
      });

      this.logger.log(`Se envio correo de reseteo del usuario ${username}`);
      return { message: MSG_OK, info: 'Usuario reseteado exitosamente' };
    } catch (error) {
      this.logger.error({ message: 'Hubo un error al enviar el correo de reseteo', info: error });
      throw new InternalServerErrorException('Hubo un error al enviar el correo de reseteo');
    }
  }
}
