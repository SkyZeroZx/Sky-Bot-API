import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  ENABLED_MYSQL_CACHE,
} from '@core/constants/Constant';
import { AuthModule } from './auth/auth.module';
import { Auth0Module, AwsS3Module } from '@core/services';
import { NotificationModule } from './notification/notification.module';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { HttpLoggingInterceptor } from '@core/interceptor/http-logging.interceptor';
import { AttachmentModule } from './attachment/attachment.module';
import { StudentModule } from './student/student.module';
import { DocumentModule } from './document/document.module';
import { StatusModule } from './status/status.module';
import { StatusDocumentModule } from './status-document/status-document.module';
import { CertificateModule } from './certificate/certificate.module';
import { HealthModule } from '@core/health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT), 10),
        username: config.get<string>(DATABASE_USERNAME),
        password: config.get<string>(DATABASE_PASSWORD),
        database: config.get<string>(DATABASE_NAME),
        timezone: 'Z',
        entities: [__dirname + './**/**/*entity{.ts,.js}'],
        cache: config.get<boolean>(ENABLED_MYSQL_CACHE),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrometheusModule.register(),
    AuthModule,
    UserModule,
    NotificationModule,
    AwsS3Module,
    HealthModule,
    AttachmentModule,
    StudentModule,
    DocumentModule,
    StatusModule,
    StatusDocumentModule,
    CertificateModule,
    Auth0Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    makeHistogramProvider({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['route', 'method', 'code'],
      // buckets for response time from 0.1ms to 500ms
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
    makeCounterProvider({
      name: 'http_request_total',
      help: 'Total of HTTP request',
      labelNames: ['route', 'method', 'code'],
    }),
    makeHistogramProvider({
      name: 'http_response_size_bytes',
      help: 'Size in bytes of response',
      labelNames: ['route', 'method', 'code'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
    makeHistogramProvider({
      name: 'http_request_size_bytes',
      help: 'Size in bytes of request',
      labelNames: ['route', 'method', 'code'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggingInterceptor)
      .exclude(
        { path: 'metrics', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
