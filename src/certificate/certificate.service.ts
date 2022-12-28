import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constants } from '@core/constants/Constant';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async createCertificate(createCertificateDto: CreateCertificateDto) {
    try {
      // TODO: ADD DI for AWS3 update certificate for register Certificate in Database with link
      // await this.certificateRepository.save({
      // })
      return { message: Constants.MSG_OK, info: 'Certificado registrado exitosamente' };
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
      return { message: Constants.MSG_OK, info: 'Certificado eliminado exitosamente' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al eliminar el certificado', error });
      throw new InternalServerErrorException('Error al eliminar el certificado');
    }
  }
}
