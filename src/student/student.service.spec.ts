import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MSG_OK } from '../core/constants';
import { Student } from './entities/student.entity';
import { StudentMockService } from './student.mock.spec';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let studentService: StudentService;
  let mockService = new StudentMockService();
  const idStudent = StudentMockService.idStudent;
  const student = StudentMockService.student;
  const dni = StudentMockService.dni;
  const createStudentDto = StudentMockService.createStudentDto;
  const pageOptionsDto = StudentMockService.pageOptionsDto;
  const updateStudentDto = StudentMockService.updateStudentDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockService,
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(studentService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validate getStudentByCode ok ', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockResolvedValueOnce(student);
    const data = await studentService.getStudentByCode(idStudent);
    expect(spyFindOneOrFail).toBeCalledWith({
      where: { idStudent: idStudent },
    });
    expect(data).toBeDefined();
    expect(data).toEqual(student);
  });

  it('validate getStudentByCode Error ', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());
    await expect(studentService.getStudentByCode(idStudent)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al buscar al estudiante'),
    );
    expect(spyFindOneOrFail).toBeCalled();
  });

  it('validate getStudentByCodeAndDni Ok', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockResolvedValueOnce(student);
    const data = await studentService.getStudentByCodeAndDni(idStudent, dni);
    expect(data).toEqual(student);
    expect(spyFindOneOrFail).toBeCalledWith({
      where: { idStudent: idStudent, dni: dni },
    });
  });

  it('validate getStudentByCodeAndDni Error', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());
    await expect(studentService.getStudentByCodeAndDni(idStudent, dni)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al buscar al estudiante'),
    );
    expect(spyFindOneOrFail).toBeCalled();
  });

  it('validate createStudent ok', async () => {
    const spyInsert = jest.spyOn(mockService, 'insert').mockResolvedValueOnce(null);
    const { message } = await studentService.createStudent(createStudentDto);
    expect(message).toEqual(MSG_OK);
    expect(spyInsert).toBeCalledWith(createStudentDto);
  });

  it('validate createStudent error', async () => {
    const spyInsert = jest.spyOn(mockService, 'insert').mockRejectedValueOnce(new Error());

    await expect(studentService.createStudent(createStudentDto)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al registrar al estudiante'),
    );
    expect(spyInsert).toBeCalled();
  });

  it('Validate getStudents ', async () => {
    const spyCreateQueryBuilder = jest.spyOn(mockService, 'createQueryBuilder');
    const spyWhere = jest.spyOn(mockService, 'where');
    const spyOrderBy = jest.spyOn(mockService, 'orderBy');
    const spyOffset = jest.spyOn(mockService, 'offset');
    const spyLimit = jest.spyOn(mockService, 'limit');
    const spyGetRawMany = jest.spyOn(mockService, 'getRawMany');
    const spyGetCount = jest.spyOn(mockService, 'getCount');
    const spyGetRawAndEntities = jest.spyOn(mockService, 'getRawAndEntities');

    await studentService.getStudents(pageOptionsDto);
    expect(spyCreateQueryBuilder).toBeCalledTimes(1);
    expect(spyWhere).toBeCalledTimes(1);
    expect(spyOrderBy).toBeCalledTimes(1);
    expect(spyOffset).toBeCalledTimes(1);
    expect(spyLimit).toBeCalledTimes(1);
    expect(spyGetRawMany).toBeCalledTimes(1);
    expect(spyGetCount).toBeCalledTimes(1);
    expect(spyGetRawAndEntities).toBeCalledTimes(1);
  });

  it('validate updateStudent Ok', async () => {
    const spyUpdate = jest.spyOn(mockService, 'update').mockResolvedValueOnce(null);
    const { message } = await studentService.updateStudent(idStudent, updateStudentDto);
    expect(message).toEqual(MSG_OK);
    expect(spyUpdate).toBeCalled();
  });

  it('validate updateStudent Error', async () => {
    const spyUpdate = jest.spyOn(mockService, 'update').mockRejectedValueOnce(new Error());
    await expect(studentService.updateStudent(idStudent, updateStudentDto)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al actualizar al estudiante'),
    );
    expect(spyUpdate).toBeCalled();
  });

  it('validate deleteStudent ok ', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockResolvedValueOnce(null);
    const { message } = await studentService.deleteStudent(idStudent);
    expect(message).toEqual(MSG_OK);
    expect(spyDelete).toBeCalledWith(idStudent);
  });

  it('validate deleteStudent error ', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockRejectedValueOnce(new Error);
    await expect(studentService.deleteStudent(idStudent)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al eliminar al estudiante'),
    );
    expect(spyDelete).toBeCalled();
  });
});
