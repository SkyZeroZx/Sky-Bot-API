import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Constants } from '@core/constants/Constant';
import { UserService } from '../../user/user.service';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AUTH0_JWKS_URI,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER,
      algorithms: [process.env.AUTH0_ALGORITHMS],
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.userId);
    switch (user.status) {
      case Constants.STATUS_USER.CREATE:
      case Constants.STATUS_USER.ENABLED:
      case Constants.STATUS_USER.RESET:
        return user;
      default:
        this.logger.warn({ message: `Su usuario no se encuentra autorizado`, user, payload });
        throw new UnauthorizedException({
          message: `Su usuario no se encuentra autorizado , tiene un status ${user.status}`,
        });
    }
  }
}
