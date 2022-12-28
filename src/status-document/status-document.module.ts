import { AttachmentModule } from '../attachment/attachment.module';
import { CertificateModule } from '../certificate/certificate.module';
import { Module } from '@nestjs/common';
import { StatusDocument } from './entities/status-document.entity';
import { StatusDocumentController } from './status-document.controller';
import { StatusDocumentService } from './status-document.service';
import { StatusModule } from '../status/status.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusDocument]),
    StatusModule,
    AttachmentModule,
    CertificateModule,
  ],
  controllers: [StatusDocumentController],
  providers: [StatusDocumentService],
})
export class StatusDocumentModule {}
