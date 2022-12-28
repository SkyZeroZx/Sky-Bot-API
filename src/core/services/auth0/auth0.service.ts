import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ManagementClient,
  AppMetadata,
  UserMetadata,
  AuthenticationClient,
  ManagementClientOptions,
} from 'auth0';

@Injectable()
export class Auth0Service {
  private readonly logger = new Logger(Auth0Service.name);
  management: ManagementClient<AppMetadata, UserMetadata>;
  auth: AuthenticationClient;
  public readonly connection = this.config.get('AUTH0_DB_NAME');
  public readonly connectionId = this.config.get('AUTH0_DB_CONNECT_ID');

  constructor(private readonly config: ConfigService) {
    let managementOptions: ManagementClientOptions = {
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    };

    this.management = new ManagementClient(managementOptions);
    this.auth = new AuthenticationClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }
}
