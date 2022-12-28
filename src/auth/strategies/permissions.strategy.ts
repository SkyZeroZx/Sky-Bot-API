import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class Permissionstrategy extends PassportStrategy(Strategy, 'permissions') {
  private readonly logger = new Logger(Permissionstrategy.name);

  constructor() {
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
    this.logger.log({ message: 'AWESOME PAYLOAD', payload });
    console.log('Get Payload is', payload);
    return payload;
  }
}
