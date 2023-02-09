import { Certificate } from './entities/certificate.entity';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsS3Module } from '@core/services';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate]), AwsS3Module],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
