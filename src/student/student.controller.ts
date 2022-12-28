import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Auth } from '@core/decorators';
import { PageOptionsDto } from '@core/interface/pagination';
import { PermissionsDecorator as Permissions } from '@core/decorators';
import { ADMIN, PERMISSIONS } from '@core/config';

@ApiTags('Student')
@ApiBearerAuth()
@Controller('student')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Creacion de nuevo estudiante' })
  create(@Body() createStudentDto: CreateStudentDto) {
    this.logger.log('Creando nuevo estudiante');
    return this.studentService.createStudent(createStudentDto);
  }

  @Get('/searchByIdStudentAndDni')
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Busqueda de estudiante por codigo y dni' })
  searchByIdStudentAndDni(@Query('idStudent') idStudent: string, @Query('dni') dni: string) {
    return this.studentService.getStudentByCodeAndDni(idStudent, dni);
  }

  @Get('/searchByIdStudent')
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Busqueda de estudiante por codigo' })
  searchbyIdStudent(@Query('idStudent') idStudent: string) {
    return this.studentService.getStudentByCode(idStudent);
  }

  @Get()
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Listado de todos los estudiantes' })
  getStudents(@Query() pageOptionsDto: PageOptionsDto) {
    this.logger.log('Listando estudiantes');
    return this.studentService.getStudents(pageOptionsDto);
  }

  @Patch(':idStudent')
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Actualización de estudiante por codigo estudiante' })
  update(@Param('idStudent') idStudent: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.updateStudent(idStudent, updateStudentDto);
  }

  @Delete(':idStudent')
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Eliminar estudiante por codigo estudiante' })
  deleteStudent(@Param('idStudent') idStudent: string) {
    this.logger.log(`Eliminando al estudiante codigo ${idStudent}`);
    return this.studentService.deleteStudent(idStudent);
  }
}
