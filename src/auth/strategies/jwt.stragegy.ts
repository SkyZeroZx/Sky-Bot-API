import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { passportJwtSecret } from 'jwks-rsa';
import { STATUS_USER } from '@core/constants';
import { ConfigService } from '@nestjs/config';
import {
  AUTH0_ALGORITHMS,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  AUTH0_JWKS_URI,
} from '@core/constants/auth0';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService, configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get(AUTH0_JWKS_URI),
        // process.env.AUTH0_JWKS_URI,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get(AUTH0_AUDIENCE),
      issuer: configService.get(AUTH0_ISSUER),
      algorithms: [configService.get(AUTH0_ALGORITHMS)],
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.userId);
    switch (user.status) {
      case STATUS_USER.CREATE:
      case STATUS_USER.ENABLED:
      case STATUS_USER.RESET:
        return user;
      default:
        this.logger.warn({
          message: `Su usuario no se encuentra autorizado`,
          info: { user, payload },
        });
        throw new UnauthorizedException(
          `Su usuario no se encuentra autorizado , tiene un status ${user.status}`,
        );
    }
  }
}
