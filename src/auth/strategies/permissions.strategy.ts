import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import {
  AUTH0_ALGORITHMS,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  AUTH0_JWKS_URI,
} from '@core/constants/auth0';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Permissionstrategy extends PassportStrategy(Strategy, 'permissions') {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get(AUTH0_JWKS_URI),
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get(AUTH0_AUDIENCE),
      issuer: configService.get(AUTH0_ISSUER),
      algorithms: [configService.get(AUTH0_ALGORITHMS)],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
