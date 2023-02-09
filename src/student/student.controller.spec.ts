import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentMockService } from './student.mock.spec';
import { StudentService } from './student.service';

describe('StudentController', () => {
  let studentController: StudentController;
  let mockService = new StudentMockService();
  const idStudent = StudentMockService.idStudent;
  const student = StudentMockService.student;
  const dni = StudentMockService.dni;
  const createStudentDto = StudentMockService.createStudentDto;
  const pageOptionsDto = StudentMockService.pageOptionsDto;
  const updateStudentDto = StudentMockService.updateStudentDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [{ provide: StudentService, useValue: mockService }],
    }).compile();

    studentController = module.get<StudentController>(StudentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
  });

  it('validate createStudent', async () => {
    const spyCreateStudent = jest.spyOn(mockService, 'createStudent');
    await studentController.createStudent(createStudentDto);
    expect(spyCreateStudent).toBeCalledWith(createStudentDto);
  });

  it('validate searchByIdStudentAndDni', async () => {
    const spySearchByIdStudentAndDni = jest.spyOn(mockService, 'getStudentByCodeAndDni');
    await studentController.getStudentByCodeAndDni(idStudent, dni);
    expect(spySearchByIdStudentAndDni).toBeCalledWith(idStudent, dni);
  });

  it('validate getStudentByCode', async () => {
    const spyGetStudentByCode = jest.spyOn(mockService, 'getStudentByCode');
    await studentController.getStudentByCode(idStudent);
    expect(spyGetStudentByCode).toBeCalledWith(idStudent);
  });

  it('validate getStudents', async () => {
    const spyGetStudents = jest.spyOn(mockService, 'getStudents');
    await studentController.getStudents(pageOptionsDto);
    expect(spyGetStudents).toBeCalledWith(pageOptionsDto);
  });

  it('validate updateStudent', async () => {
    const spyUpdateStudent = jest.spyOn(mockService, 'updateStudent');
    await studentController.updateStudent(idStudent, updateStudentDto);
    expect(spyUpdateStudent).toBeCalledWith(idStudent, updateStudentDto);
  });

  it('validate deleteStudent', async () => {
    const spyDeleteStudent = jest.spyOn(mockService, 'deleteStudent');
    await studentController.deleteStudent(idStudent);
    expect(spyDeleteStudent).toBeCalledWith(idStudent);
  });
});
