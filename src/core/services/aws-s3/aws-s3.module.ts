import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ATTACHMENT_SERVER_MAX_REDIRECT, ATTACHMENT_SERVER_TIMEOUT } from '@core/constants';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get(ATTACHMENT_SERVER_TIMEOUT),
        maxRedirects: configService.get(ATTACHMENT_SERVER_MAX_REDIRECT),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
