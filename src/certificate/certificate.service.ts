import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { Repository } from 'typeorm';
import { MSG_OK } from '@core/constants';
import { AwsS3Service } from '@core/services';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { fileNamer } from '@core/helpers';

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async createCertificate(file: Express.Multer.File, createCertificateDto: CreateCertificateDto) {
    try {
      const { Location } = await this.awsS3Service.uploadFile(
        file.buffer,
        fileNamer(file, crypto.randomUUID()),
      );

      await this.certificateRepository.save({
        idStatusDocument: createCertificateDto.idStatusDocument,
        url: Location,
      });

      return { message: MSG_OK, info: 'Certificado registrado exitosamente' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al registrar el certificado', error });
      throw new InternalServerErrorException('Error al registrar el certificado');
    }
  }

  async getCertificateByIdStatusDocument(idStatusDocument: string) {
    this.logger.log(`Buscando certificado para codigo ${idStatusDocument}`);
    try {
      return await this.certificateRepository.findBy({
        idStatusDocument,
      });
    } catch (error) {
      this.logger.error({ message: 'Error obtener certificado', error });
      throw new InternalServerErrorException(
        'Sucedio un error al obtener certificado para el estudiante',
      );
    }
  }

  async deleteCertificateByIdStatusDocument(idCertificate: string) {
    this.logger.log(`Eliminando certificado para codigo ${idCertificate}`);
    try {
      await this.certificateRepository.delete(idCertificate);
      return { message: MSG_OK, info: 'Certificado eliminado exitosamente' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al eliminar el certificado', error });
      throw new InternalServerErrorException('Error al eliminar el certificado');
    }
  }
}
