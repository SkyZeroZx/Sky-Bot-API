import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.stragegy';
import { Auth0Module } from '@core/services/auth0/auth0.module';
import { Permissionstrategy } from './strategies/permissions.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'permissions'] }),
    JwtModule,
    Auth0Module,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Permissionstrategy],
})
export class AuthModule {}
