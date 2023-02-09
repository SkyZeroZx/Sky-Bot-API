import { CreateCertificateDto } from './dto/create-certificate.dto';

export class CertificateMock {
  public findBy = jest.fn().mockReturnThis();
  public save = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  public uploadFile = jest.fn().mockReturnThis();
  public static readonly idCertificate: string = '32423423';
  public static readonly idStatusDocument: string = 'SADASDASD436534';

  public createCertificate = jest.fn().mockReturnThis();
  public getCertificateByIdStatusDocument = jest.fn().mockReturnThis();
  public deleteCertificateByIdStatusDocument = jest.fn().mockReturnThis();

  public static readonly createCertificateDto: CreateCertificateDto = {
    idStatusDocument: this.idStatusDocument,
  };
  public static readonly uploadLocation: string = 'http://localhost/awesome-upload';

  public static readonly fileMock = {
    fieldname: ',',
    originalname: 'string',
    encoding: 'string',
    mimetype: 'string',
    size: 23423,
    stream: null,
    destination: 'string',
    filename: 'string',
    path: 'string',
    buffer: [],
  };
}
