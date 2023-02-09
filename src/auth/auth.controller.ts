import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User as UserEntity } from '../user/entities/user.entity';
import { AuthResponse } from '@core/swagger/response';
import { Auth, UserDecorator as User } from '@core/decorators';
import { ADMIN, ALL_ROLES } from '@core/config';
import { UserResetPasswordDto } from './dtos/user-reset-password.dto';

@ApiTags('Autentification')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Auth([ADMIN])
  @Post('reset-password')
  @ApiOperation({ summary: 'Reseteo de contraseña administrativo' })
  @ApiResponse(AuthResponse.resetPassword)
  async resetPassword(@Body() { username }: UserResetPasswordDto) {
    this.logger.log(`Reseteando usuario ${username}`);
    return this.authService.resetPassword(username);
  }

  @Auth([...ALL_ROLES])
  @Post('change-password')
  @ApiOperation({ summary: 'Cambio de contraseña a demanda por usuario logeado' })
  @ApiResponse(AuthResponse.changePassword)
  async changePassword(@User() user: UserEntity) {
    this.logger.log({ message: 'Solicitud de cambio de contraseña del usuario', user });
    return this.authService.resetPassword(user.username);
  }
}
