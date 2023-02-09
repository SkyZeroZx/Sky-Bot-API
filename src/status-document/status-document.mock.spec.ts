import { PageOptionsDto } from '../core/interface/pagination';
import { CreateStatusDocumentDto } from './dto/create-status-document.dto';

export class StatusDocumentMock {
  public select = jest.fn().mockReturnThis();
  public where = jest.fn().mockReturnThis();
  public execute = jest.fn().mockReturnThis();
  public getRawMany = jest.fn().mockReturnThis();
  public andWhere = jest.fn().mockReturnThis();
  public innerJoin = jest.fn().mockReturnThis();
  public leftJoin = jest.fn().mockReturnThis();
  public orderBy = jest.fn().mockReturnThis();
  public skip = jest.fn().mockReturnThis();
  public insert = jest.fn().mockReturnThis();
  public limit = jest.fn().mockReturnThis();
  public addSelect = jest.fn().mockReturnThis();
  public getRawOne = jest.fn().mockReturnThis();
  public getCount = jest.fn().mockReturnThis();

  public createQueryBuilder = jest.fn(() => ({
    where: this.where,
    select: this.select,
    getRawMany: this.getRawMany,
    execute: this.execute,
    andWhere: this.andWhere,
    innerJoin: this.innerJoin,
    leftJoin: this.leftJoin,
    addSelect : this.addSelect,
    orderBy: this.orderBy,
    skip: this.skip,
    limit: this.limit,
    getCount : this.getCount,
    getRawOne : this.getRawOne
  }));

  public createStatus = jest.fn().mockReturnThis();
  public getStatusByIdStatusDocument = jest.fn().mockReturnThis();
  public getAttachmentsByIdStatusDocument = jest.fn().mockReturnThis();
  public getCertificateByIdStatusDocument = jest.fn().mockReturnThis();
  public createStatusDocument = jest.fn().mockReturnThis();
  public getStudentDocument = jest.fn().mockReturnThis();
  public getStatusDocumentByDni = jest.fn().mockReturnThis();
  public getStatusDocumentById = jest.fn().mockReturnThis();

  public static readonly idStatusDocument  : string = 'AWESOME_CODE_12312312'
  public static readonly dni  : string = '12345678';
  public static readonly createStatusDocumentDto: CreateStatusDocumentDto = {
    idStatusDocument: '5255',
    idStudent: '155',
    idDocument: 25,
  };

  public static readonly pageOptionsDto: PageOptionsDto = {
    search: 'awesome serach',
    page: 1,
    optionalSearch: 'awesome search optional',
    skip: 0,
    take: 10,
  };
}
