import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Auth } from '@core/decorators';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { ADMIN, EMPLOYEE } from '@core/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '@core/helpers';

@ApiTags('Certificate')
@ApiBearerAuth()
@Controller('certificate')
export class CertificateController {
  private readonly logger = new Logger(CertificateController.name);

  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Registro de certificado para estudiante' })
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  createCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    this.logger.log({ message: 'Subiendo certificado', createCertificateDto });
    return this.certificateService.createCertificate(file, createCertificateDto);
  }

  @Get(':idStatusDocument')
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Obtener certificados apartir del idStatusDocument' })
  getCertificateByIdStatusDocument(@Param('idStatusDocument') idStatusDocument: string) {
    this.logger.log({ message: `Obteniendo certificados para ${idStatusDocument}` });
    return this.certificateService.getCertificateByIdStatusDocument(idStatusDocument);
  }

  @Delete(':idCertificate')
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Eliminar certificado por idCertificate' })
  deleteCertificateByIdStatusDocument(@Param('idCertificate') idCertificate: string) {
    this.logger.log({ message: `Eliminando certificado para ${idCertificate}` });
    return this.certificateService.deleteCertificateByIdStatusDocument(idCertificate);
  }
}
