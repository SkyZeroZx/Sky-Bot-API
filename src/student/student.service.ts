import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from '@core/interface/pagination';
import { MSG_OK } from '@core/constants/general';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async getStudentByCode(idStudent: string): Promise<Student> {
    this.logger.log(`Buscando estudiante con codigo ${idStudent}`);
    try {
      return await this.studentRepository.findOneOrFail({
        where: { idStudent: idStudent },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al buscar al estudiante codigo ${idStudent}`);
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al buscar al estudiante');
    }
  }

  async getStudentByCodeAndDni(idStudent: string, dni: string) {
    this.logger.log(`Buscando estudiante con codigo ${idStudent}`);
    try {
      return await this.studentRepository.findOneOrFail({
        where: { idStudent: idStudent, dni: dni },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al buscar al estudiante codigo ${idStudent}`);
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al buscar al estudiante');
    }
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    try {
      await this.studentRepository.insert(createStudentDto);
      return { message: MSG_OK, info: 'Se registro exitosamente al estudiante' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al registrar al estudiante', info: error });
      throw new InternalServerErrorException('Sucedio un error al registrar al estudiante');
    }
  }

  async getStudents(pageOptionsDto: PageOptionsDto) {
    const studentQueryBuilder = this.studentRepository.createQueryBuilder('STUDENT');

    if (pageOptionsDto.search) {
      studentQueryBuilder.where(
        'STUDENT.name LIKE :search OR STUDENT.lastName LIKE :search OR STUDENT.idStudent LIKE :search',
        {
          search: `%${pageOptionsDto.search}%`,
        },
      );
    }

    await studentQueryBuilder
      .orderBy('STUDENT.name', pageOptionsDto.order)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .getRawMany();

    const itemCount = await studentQueryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const { entities } = await studentQueryBuilder.getRawAndEntities();
    return new PageDto(entities, pageMetaDto);
  }

  async updateStudent(idStudent: string, updateStudentDto: UpdateStudentDto) {
    this.logger.log({ message: 'Actualizando estudiante', updateStudentDto, idStudent });
    try {
      await this.studentRepository.update(idStudent, updateStudentDto);
      return { message: MSG_OK, info: 'Se actualizo exitosamente al estudiante' };
    } catch (error) {
      this.logger.error({ message: 'Error al actualizar estudiante', error });
      throw new InternalServerErrorException('Sucedio un error al actualizar al estudiante');
    }
  }

  async deleteStudent(idStudent: string) {
    try {
      await this.studentRepository.delete(idStudent);
      return { message: MSG_OK, info: 'Se elimino exitosamente al estudiante' };
    } catch (error) {
      this.logger.error({ message: 'Error al eliminar el estudiante', info: error });
      throw new InternalServerErrorException('Sucedio un error al eliminar al estudiante');
    }
  }
}
