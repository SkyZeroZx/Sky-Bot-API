import { PageOptionsDto } from '../core/interface/pagination';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

export class StudentMockService {
  public findOneOrFail = jest.fn().mockReturnThis();
  public update = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
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
  public offset = jest.fn().mockReturnThis();

  public getRawAndEntities = jest.fn().mockReturnThis();

  public createQueryBuilder = jest.fn(() => ({
    where: this.where,
    select: this.select,
    getRawMany: this.getRawMany,
    execute: this.execute,
    andWhere: this.andWhere,
    innerJoin: this.innerJoin,
    leftJoin: this.leftJoin,
    addSelect: this.addSelect,
    orderBy: this.orderBy,
    skip: this.skip,
    limit: this.limit,
    getCount: this.getCount,
    getRawOne: this.getRawOne,
    offset: this.offset,
    getRawAndEntities: this.getRawAndEntities,
  }));

  public static readonly idStudent = '161522525555';
  public static readonly dni = '78945632';

  public static readonly student: Student = {
    idStudent: '23432',
    name: 'awesome student',
    lastName: 'awesome last name',
    phone: '123456789',
    caracterValidation: '1',
    dni: '789654123',
    email: 'awesome_email@example.com',
  };

  public static createStudentDto: CreateStudentDto = {
    idStudent: '23432',
    name: 'awesome student',
    lastName: 'awesome last name',
    phone: '123456789',
    caracterValidation: '1',
    dni: '789654123',
    email: 'awesome_email@example.com',
  };

  public static readonly updateStudentDto: UpdateStudentDto = {
    ...this.createStudentDto,
  };

  public static readonly pageOptionsDto: PageOptionsDto = {
    search: 'awesome serach',
    page: 1,
    optionalSearch: 'awesome search optional',
    skip: 0,
    take: 10,
  };

  public createStudent = jest.fn().mockReturnThis();
  public getStudentByCodeAndDni = jest.fn().mockReturnThis();
  public getStudentByCode = jest.fn().mockReturnThis();
  public getStudents = jest.fn().mockReturnThis();
  public updateStudent = jest.fn().mockReturnThis();
  public deleteStudent = jest.fn().mockReturnThis();
}
