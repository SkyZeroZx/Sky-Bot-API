import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MSG_OK } from '@core/constants';
import { CertificateMock } from './certificate.mock.spec';
import { CertificateService } from './certificate.service';
import { Certificate } from './entities/certificate.entity';
import { AwsS3Service } from '@core/services';

describe('CertificateService', () => {
  let certificateService: CertificateService;
  let mockService = new CertificateMock();
  const idCertificate = CertificateMock.idCertificate;
  const idStatusDocument = CertificateMock.idStatusDocument;
  const file = CertificateMock.fileMock as unknown as Express.Multer.File;
  const createCertificateDto = CertificateMock.createCertificateDto;
  const uploadLocation = CertificateMock.uploadLocation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificateService,
        {
          provide: getRepositoryToken(Certificate),
          useValue: mockService,
        },
        {
          provide: AwsS3Service,
          useValue: mockService,
        },
      ],
    }).compile();

    certificateService = module.get<CertificateService>(CertificateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(certificateService).toBeDefined();
  });

  it('validate createCertificate Ok', async () => {
    const spyUploadFile = jest
      .spyOn(mockService, 'uploadFile')
      .mockResolvedValueOnce({ Location: uploadLocation });
    const spySave = jest.spyOn(mockService, 'save');
    const { message } = await certificateService.createCertificate(file, createCertificateDto);
    expect(message).toEqual(MSG_OK);
    expect(spyUploadFile).toBeCalled();
    expect(spySave).toBeCalledWith({
      idStatusDocument: createCertificateDto.idStatusDocument,
      url: uploadLocation,
    });
  });

  it('validate createCertificate error', async () => {
    const spyUploadFile = jest.spyOn(mockService, 'uploadFile').mockRejectedValueOnce(new Error());
    await expect(
      certificateService.createCertificate(file, createCertificateDto),
    ).rejects.toThrowError(new InternalServerErrorException('Error al registrar el certificado'));
    expect(spyUploadFile).toBeCalled();
  });

  it('Validate getCertificateByIdStatusDocument Ok', async () => {
    const spyFindBy = jest.spyOn(mockService, 'findBy').mockResolvedValueOnce(null);
    await certificateService.getCertificateByIdStatusDocument(idStatusDocument);
    expect(spyFindBy).toBeCalled();
  });

  it('Validate getCertificateByIdStatusDocument Error', async () => {
    const spyFindBy = jest.spyOn(mockService, 'findBy').mockRejectedValueOnce(new Error());
    await expect(
      certificateService.getCertificateByIdStatusDocument(idStatusDocument),
    ).rejects.toThrowError(
      new InternalServerErrorException(
        'Sucedio un error al obtener certificado para el estudiante',
      ),
    );
    expect(spyFindBy).toBeCalled();
  });

  it('validate deleteCertificateByIdStatusDocument Ok', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockResolvedValueOnce(null);
    const { message } = await certificateService.deleteCertificateByIdStatusDocument(idCertificate);
    expect(spyDelete).toBeCalledWith(idCertificate);
    expect(message).toEqual(MSG_OK);
  });

  it('validate deleteCertificateByIdStatusDocument Error', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockRejectedValueOnce(new Error());
    await expect(
      certificateService.deleteCertificateByIdStatusDocument(idCertificate),
    ).rejects.toThrowError(new InternalServerErrorException('Error al eliminar el certificado'));
    expect(spyDelete).toBeCalledWith(idCertificate);
  });
});
