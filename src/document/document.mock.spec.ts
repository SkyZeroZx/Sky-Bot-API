import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

export class DocumentServiceMock {
  public save = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  public update = jest.fn().mockReturnThis();
  public findOneOrFail = jest.fn().mockReturnThis();
  public find = jest.fn().mockReturnThis();
  public static readonly documentName: string = 'AWESOME_DOCUMENT_NAME';

  public static readonly idDocument: number = 23432;

  public static readonly document: Document = {
    idDocument: 25,
    name: 'AWESOME NAME',
    requirements: 'AWESOME REQUIRED',
  };

  public static readonly createDocumentDto: CreateDocumentDto = {
    name: 'AWESOME NAME',
    requirements: 'AWESOME REQUIRED',
  };

  public static updateDocumentDto: UpdateDocumentDto = {
    ...this.createDocumentDto,
  };

  public createDocument = jest.fn().mockReturnThis();
  public getAllDocuments = jest.fn().mockReturnThis();
  public updateDocument = jest.fn().mockReturnThis();
  public deleteDocument = jest.fn().mockReturnThis();
  public getDocumentByName = jest.fn().mockReturnThis();
}
