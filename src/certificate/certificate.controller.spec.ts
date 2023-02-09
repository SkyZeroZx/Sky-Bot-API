import { Test, TestingModule } from '@nestjs/testing';
import { CertificateController } from './certificate.controller';
import { CertificateMock } from './certificate.mock.spec';
import { CertificateService } from './certificate.service';

describe('CertificateController', () => {
  let certificateController: CertificateController;
  let mockService = new CertificateMock();
  const idCertificate = CertificateMock.idCertificate;
  const idStatusDocument = CertificateMock.idStatusDocument;
  const file = CertificateMock.fileMock as unknown as Express.Multer.File;
  const createCertificateDto = CertificateMock.createCertificateDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [
        {
          provide: CertificateService,
          useValue: mockService,
        },
      ],
    }).compile();

    certificateController = module.get<CertificateController>(CertificateController);
  });

  it('should be defined', () => {
    expect(certificateController).toBeDefined();
  });

  it('validate createCertificate', async () => {
    const spyCreateCertificate = jest.spyOn(mockService, 'createCertificate');
    await certificateController.createCertificate(file, createCertificateDto);
    expect(spyCreateCertificate).toBeCalled();
  });

  it('validate getCertificateByIdStatusDocument', async () => {
    const spyGetCertificateByIdStatusDocument = jest.spyOn(
      mockService,
      'getCertificateByIdStatusDocument',
    );
    await certificateController.getCertificateByIdStatusDocument(idStatusDocument);
    expect(spyGetCertificateByIdStatusDocument).toBeCalled();
  });

  it('validate deleteCertificateByIdStatusDocument', async () => {
    const spyDeleteCertificateByIdStatusDocument = jest.spyOn(
      mockService,
      'deleteCertificateByIdStatusDocument',
    );
    await certificateController.deleteCertificateByIdStatusDocument(idCertificate);
    expect(spyDeleteCertificateByIdStatusDocument).toBeCalled();
  });
});
