import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwsS3Service } from '@core/services';
import { MSG_OK } from '@core/constants';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachment } from './entities/attachment.entity';
import { AttachmentServerResponse } from '@core/interface/attachment-server';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async registerAttachment({ idStatusDocument, listUrl }: CreateAttachmentDto) {
    this.logger.log({ message: 'registerAttachment', idStatusDocument, listUrl });
    try {
      const listUpload: Promise<AttachmentServerResponse>[] = [];
      const listRegisterAttachment: Promise<Attachment>[] = [];
      for (const url of listUrl) {
        listUpload.push(this.awsS3Service.uploadAttachment(url));
      }

      const resolveListUpload = await Promise.all(listUpload);

      for (const upload of resolveListUpload) {
        listRegisterAttachment.push(
          this.attachmentRepository.save({
            idStatusDocument,
            url: upload.Location,
          }),
        );
      }

      this.logger.log({ message: 'resolveListUpload', resolveListUpload });

      await Promise.all(listRegisterAttachment);

      return { message: MSG_OK, info: 'Attachments successfully registered' };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al registrar el adjunto');
    }
  }

  async getAttachmentsByIdStatusDocument(idStatusDocument: string): Promise<Attachment[]> {
    try {
      return await this.attachmentRepository.findBy({ idStatusDocument });
    } catch (error) {
      this.logger.error({ message: 'Error al obtener adjuntos', error });
      throw new InternalServerErrorException('Sucedio un error al obtener adjuntos');
    }
  }
}
