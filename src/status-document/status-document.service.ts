import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constants } from '@core/constants/Constant';
import { PageDto, PageMetaDto, PageOptionsDto } from '@core/interface/pagination';
import { Document } from '../document/entities/document.entity';
import { Status } from '../status/entities/status.entity';
import { Student } from '../student/entities/student.entity';
import { CreateStatusDocumentDto } from './dto/create-status-document.dto';
import { StatusDocument } from './entities/status-document.entity';
import { StatusService } from '../status/status.service';
import { AttachmentService } from '../attachment/attachment.service';
import { CertificateService } from '../certificate/certificate.service';

@Injectable()
export class StatusDocumentService {
  private readonly logger = new Logger(StatusDocumentService.name);
  constructor(
    @InjectRepository(StatusDocument)
    private readonly statusDocumentRepository: Repository<StatusDocument>,
    private statusService: StatusService,
    private attachmentsService: AttachmentService,
    private certificateService: CertificateService,
  ) {}

  async createStatusDocument(createStatusDocumentDto: CreateStatusDocumentDto) {
    this.logger.log({ message: 'Registrando tramite ', createStatusDocumentDto });
    try {
      const statusDocument = await this.statusDocumentRepository.insert(createStatusDocumentDto);
      this.logger.log({ message: 'documento registrado es ', statusDocument });
      return { message: Constants.MSG_OK, info: 'Se registro exitosamente el StatusDocument' };
    } catch (error) {
      this.logger.error({
        message: 'Sucedio un error al registrar status document ',
        createStatusDocumentDto,
      });
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al registrar status document');
    }
  }

  async getStudentDocument(pageOptionsDto: PageOptionsDto) {
    const studentDocumentBuilder =
      this.statusDocumentRepository.createQueryBuilder('STUDENT_DOCUMENT');

    if (pageOptionsDto.search) {
      studentDocumentBuilder.andWhere(
        `CONCAT(STUDENT.name , ' ' ,  STUDENT.lastname) LIKE :search`,
        {
          search: `%${pageOptionsDto.search}%`,
        },
      );
    }

    if (pageOptionsDto.optionalSearch) {
      studentDocumentBuilder.andWhere('STATUS.status =:optionalSearch', {
        optionalSearch: pageOptionsDto.optionalSearch,
      });
    }

    const statusDocument = await studentDocumentBuilder
      .select('STUDENT_DOCUMENT.idStatusDocument', 'idStatusDocument')
      .addSelect('STUDENT_DOCUMENT.idStudent', 'idStudent')
      .addSelect('STUDENT.name', 'studentName')
      .addSelect('STUDENT.lastName', 'studentLastName')
      .addSelect('DOCUMENT.name', 'documentName')
      .addSelect('STATUS.status', 'status')
      .addSelect('STATUS.registerDate', 'registerDate')
      .innerJoin(Student, 'STUDENT', 'STUDENT.idStudent = STUDENT_DOCUMENT.idStudent')
      .innerJoin(Document, 'DOCUMENT', 'DOCUMENT.idDocument = STUDENT_DOCUMENT.idDocument')
      .innerJoin(Status, 'STATUS', 'STATUS.idStatusDocument = STUDENT_DOCUMENT.idStatusDocument')
      .leftJoin(
        Status,
        'LEFT_STATUS',
        'STATUS.idStatusDocument = LEFT_STATUS.idStatusDocument AND STATUS.registerDate < LEFT_STATUS.registerDate',
      )
      .orderBy('STATUS.registerDate', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .andWhere('LEFT_STATUS.idStatusDocument is null')
      .getRawMany();

    const itemCount = await studentDocumentBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(statusDocument, pageMetaDto);
  }

  async getStatusDocumentById(idStatusDocument: string) {
    const statusDocumentByStudent = await this.statusDocumentRepository
      .createQueryBuilder('STATUS_DOCUMENT')
      .select('STATUS_DOCUMENT.idStatusDocument', 'idStatusDocument')
      .addSelect('STATUS_DOCUMENT.idStudent', 'idStudent')
      .addSelect('STUDENT.name', 'studentName')
      .addSelect('STUDENT.lastName', 'studentLastName')
      .addSelect('DOCUMENT.name', 'documentName')
      .innerJoin(Student, 'STUDENT', 'STUDENT.idStudent = STATUS_DOCUMENT.idStudent')
      .innerJoin(Document, 'DOCUMENT', 'DOCUMENT.idDocument = STATUS_DOCUMENT.idDocument')
      .where('STATUS_DOCUMENT.idStatusDocument =:idStatusDocument', { idStatusDocument })
      .getRawOne();

    const statusDocument = await this.statusService.getStatusByIdStatusDocument(idStatusDocument);
    const listAttachment = await this.attachmentsService.getAttachmentsByIdStatusDocument(
      idStatusDocument,
    );
    const listCertificate = await this.certificateService.getCertificateByIdStatusDocument(
      idStatusDocument,
    );
    return { statusDocumentByStudent, statusDocument, listAttachment, listCertificate };
  }

  async getStatusDocumentByDni(dni: string) {
    return await this.statusDocumentRepository
      .createQueryBuilder('STUDENT_DOCUMENT')
      .select('STUDENT_DOCUMENT.idStatusDocument', 'idStatusDocument')
      .addSelect('STUDENT_DOCUMENT.idStudent', 'idStudent')
      .addSelect('STUDENT.name', 'studentName')
      .addSelect('STUDENT.lastName', 'studentLastName')
      .addSelect('DOCUMENT.name', 'documentName')
      .addSelect('STATUS.status', 'status')
      .addSelect('STATUS.registerDate', 'registerDate')
      .innerJoin(Student, 'STUDENT', 'STUDENT.idStudent = STUDENT_DOCUMENT.idStudent')
      .innerJoin(Document, 'DOCUMENT', 'DOCUMENT.idDocument = STUDENT_DOCUMENT.idDocument')
      .innerJoin(Status, 'STATUS', 'STATUS.idStatusDocument = STUDENT_DOCUMENT.idStatusDocument')
      .leftJoin(
        Status,
        'LEFT_STATUS',
        'STATUS.idStatusDocument = LEFT_STATUS.idStatusDocument AND STATUS.registerDate < LEFT_STATUS.registerDate',
      )
      .orderBy('STATUS.registerDate', 'ASC')
      .andWhere('LEFT_STATUS.idStatusDocument is null')
      .andWhere('STUDENT.dni =:dni', { dni })
      .getRawMany();
  }
}
