import { Module } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { Auth0Controller } from './auth0.controller';

@Module({
  controllers: [Auth0Controller],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}
