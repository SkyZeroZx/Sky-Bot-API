import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 25000,
        maxRedirects: 35,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
