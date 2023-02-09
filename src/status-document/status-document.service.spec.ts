import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttachmentService } from '../attachment/attachment.service';
import { CertificateService } from '../certificate/certificate.service';
import { MSG_OK } from '@core/constants';
import { StatusService } from '../status/status.service';
import { StatusDocument } from './entities/status-document.entity';
import { StatusDocumentMock } from './status-document.mock.spec';
import { StatusDocumentService } from './status-document.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Student } from '../student/entities/student.entity';
import { Document } from '../document/entities/document.entity';
import { Status } from '../status/entities/status.entity';

describe('StatusDocumentService', () => {
  let statusDocumentService: StatusDocumentService;
  let statusDocumentServiceMock = new StatusDocumentMock();
  let statusService: StatusService;
  let attachmentService: AttachmentService;
  let certificateService: CertificateService;
  const createStatusDocumentDto = StatusDocumentMock.createStatusDocumentDto;
  const idStatusDocument = StatusDocumentMock.idStatusDocument;
  const dni = StatusDocumentMock.dni;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusDocumentService,
        {
          provide: getRepositoryToken(StatusDocument),
          useValue: statusDocumentServiceMock,
        },
        {
          provide: StatusService,
          useValue: statusDocumentServiceMock,
        },
        {
          provide: AttachmentService,
          useValue: statusDocumentServiceMock,
        },
        {
          provide: CertificateService,
          useValue: statusDocumentServiceMock,
        },
      ],
    }).compile();

    statusDocumentService = module.get<StatusDocumentService>(StatusDocumentService);
    statusService = module.get<StatusService>(StatusService);
    attachmentService = module.get<AttachmentService>(AttachmentService);
    certificateService = module.get<CertificateService>(CertificateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(statusDocumentService).toBeDefined();
  });

  it('Validate createStatusDocument ok', async () => {
    const spyCreateStatus = jest.spyOn(statusService, 'createStatus').mockResolvedValueOnce(null);
    const spyInsertOk = jest.spyOn(statusDocumentServiceMock, 'insert').mockResolvedValueOnce(null);
    const { message } = await statusDocumentService.createStatusDocument(createStatusDocumentDto);
    expect(message).toEqual(MSG_OK);
    expect(spyInsertOk).toBeCalled();
    expect(spyCreateStatus).toBeCalled();
  });

  it('Validate createStatusDocument Error', async () => {
    const spyCreateStatus = jest
      .spyOn(statusService, 'createStatus')
      .mockRejectedValueOnce(new Error());

    await expect(
      statusDocumentService.createStatusDocument(createStatusDocumentDto),
    ).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al registrar status document'),
    );
    expect(spyCreateStatus).toBeCalled();
  });

  it('Validate getStudentDocument with pagination', async () => {
    const spyCreateQueryBuilder = jest.spyOn(statusDocumentServiceMock, 'createQueryBuilder');
    const spySelect = jest.spyOn(statusDocumentServiceMock, 'select');
    const spyAndWhere = jest.spyOn(statusDocumentServiceMock, 'andWhere');
    const spyAddSelect = jest.spyOn(statusDocumentServiceMock, 'addSelect');
    const spyInnerJoin = jest.spyOn(statusDocumentServiceMock, 'innerJoin');
    const spyLeftJoin = jest.spyOn(statusDocumentServiceMock, 'leftJoin');
    const spyOrderBy = jest.spyOn(statusDocumentServiceMock, 'orderBy');
    const spySkip = jest.spyOn(statusDocumentServiceMock, 'skip');
    const spyLimit = jest.spyOn(statusDocumentServiceMock, 'limit');
    const spyGetRawMany = jest.spyOn(statusDocumentServiceMock, 'getRawMany');

    await statusDocumentService.getStudentDocument(StatusDocumentMock.pageOptionsDto);
    expect(spyCreateQueryBuilder).toBeCalledWith('STATUS_DOCUMENT');
    expect(spySelect).toBeCalledTimes(1);
    expect(spyAndWhere).toBeCalledTimes(3);
    expect(spyAddSelect).toBeCalledTimes(6);
    expect(spyInnerJoin).toBeCalledTimes(3);
    expect(spyLeftJoin).toBeCalledTimes(1);
    expect(spyOrderBy).toBeCalledTimes(1);
    expect(spySkip).toBeCalledTimes(1);
    expect(spyLimit).toBeCalledTimes(1);
    expect(spyGetRawMany).toBeCalledTimes(1);
  });

  it('validate getStatusDocumentById', async () => {
    const spyGetDocumentById = jest
      .spyOn(statusDocumentService, 'getDocumentById')
      .mockResolvedValueOnce(null);
    const spyGetStatusByIdStatusDocument = jest
      .spyOn(statusService, 'getStatusByIdStatusDocument')
      .mockResolvedValueOnce([]);
    const spyGetAttachmentsByIdStatusDocument = jest
      .spyOn(attachmentService, 'getAttachmentsByIdStatusDocument')
      .mockResolvedValueOnce([]);
    const spyGetCertificateByIdStatusDocument = jest
      .spyOn(certificateService, 'getCertificateByIdStatusDocument')
      .mockResolvedValueOnce([]);

    const data = await statusDocumentService.getStatusDocumentById(idStatusDocument);
    expect(spyGetDocumentById).toBeCalled();
    expect(spyGetStatusByIdStatusDocument).toBeCalled();
    expect(spyGetAttachmentsByIdStatusDocument).toBeCalled();
    expect(spyGetCertificateByIdStatusDocument).toBeCalled();
    expect(data).toBeDefined();
  });

  it('validate getDocumentById', async () => {
    const spyQueryBuilder = jest.spyOn(statusDocumentServiceMock, 'createQueryBuilder');
    const spySelect = jest.spyOn(statusDocumentServiceMock, 'select');
    const spyAddSelect = jest.spyOn(statusDocumentServiceMock, 'addSelect');
    const spyInnerJoin = jest.spyOn(statusDocumentServiceMock, 'innerJoin');
    const spyWhere = jest.spyOn(statusDocumentServiceMock, 'where');
    const spyGetRawOne = jest.spyOn(statusDocumentServiceMock, 'getRawOne');
    await statusDocumentService.getDocumentById(idStatusDocument);
    expect(spyQueryBuilder).toBeCalledWith('STATUS_DOCUMENT');
    expect(spySelect).toHaveBeenNthCalledWith(
      1,
      'STATUS_DOCUMENT.idStatusDocument',
      'idStatusDocument',
    );
    expect(spyAddSelect).toHaveBeenNthCalledWith(1, 'STATUS_DOCUMENT.idStudent', 'idStudent');
    expect(spyAddSelect).toHaveBeenNthCalledWith(2, 'STUDENT.name', 'studentName');
    expect(spyAddSelect).toHaveBeenNthCalledWith(3, 'STUDENT.lastName', 'studentLastName');
    expect(spyAddSelect).toHaveBeenNthCalledWith(4, 'DOCUMENT.name', 'documentName');
    expect(spyInnerJoin).toHaveBeenNthCalledWith(
      1,
      Student,
      'STUDENT',
      'STUDENT.idStudent = STATUS_DOCUMENT.idStudent',
    );
    expect(spyInnerJoin).toHaveBeenNthCalledWith(
      2,
      Document,
      'DOCUMENT',
      'DOCUMENT.idDocument = STATUS_DOCUMENT.idDocument',
    );
    expect(spyWhere).toHaveBeenNthCalledWith(
      1,
      'STATUS_DOCUMENT.idStatusDocument =:idStatusDocument',
      { idStatusDocument },
    );
    expect(spyGetRawOne).toBeCalled();
  });

  it('validate getStatusDocumentByDni', async () => {
    const spyQueryBuilder = jest.spyOn(statusDocumentServiceMock, 'createQueryBuilder');
    const spySelect = jest.spyOn(statusDocumentServiceMock, 'select');
    const spyAddSelect = jest.spyOn(statusDocumentServiceMock, 'addSelect');
    const spyInnerJoin = jest.spyOn(statusDocumentServiceMock, 'innerJoin');
    const spyGetRawMany = jest.spyOn(statusDocumentServiceMock, 'getRawMany');
    const spyOrderBy = jest.spyOn(statusDocumentServiceMock, 'orderBy');
    const spyAndWhere = jest.spyOn(statusDocumentServiceMock, 'andWhere');
    await statusDocumentService.getStatusDocumentByDni(dni);
    expect(spyQueryBuilder).toBeCalledWith('STATUS_DOCUMENT');
    expect(spySelect).toHaveBeenNthCalledWith(
      1,
      'STATUS_DOCUMENT.idStatusDocument',
      'idStatusDocument',
    );
    expect(spyAddSelect).toHaveBeenNthCalledWith(1, 'STATUS_DOCUMENT.idStudent', 'idStudent');
    expect(spyAddSelect).toHaveBeenNthCalledWith(2, 'STUDENT.name', 'studentName');
    expect(spyAddSelect).toHaveBeenNthCalledWith(3, 'STUDENT.lastName', 'studentLastName');
    expect(spyAddSelect).toHaveBeenNthCalledWith(4, 'DOCUMENT.name', 'documentName');
    expect(spyInnerJoin).toHaveBeenNthCalledWith(
      1,
      Student,
      'STUDENT',
      'STUDENT.idStudent = STATUS_DOCUMENT.idStudent',
    );
    expect(spyInnerJoin).toHaveBeenNthCalledWith(
      2,
      Document,
      'DOCUMENT',
      'DOCUMENT.idDocument = STATUS_DOCUMENT.idDocument',
    );
    expect(spyInnerJoin).toHaveBeenNthCalledWith(
      3,
      Status,
      'STATUS',
      'STATUS.idStatusDocument = STATUS_DOCUMENT.idStatusDocument',
    );
    expect(spyOrderBy).toBeCalledWith('STATUS.registerDate', 'ASC');
    expect(spyAndWhere).toHaveBeenNthCalledWith(1, 'LEFT_STATUS.idStatusDocument is null');
    expect(spyAndWhere).toHaveBeenNthCalledWith(2, 'STUDENT.dni =:dni', { dni });
    expect(spyGetRawMany).toBeCalled();
  });
});
