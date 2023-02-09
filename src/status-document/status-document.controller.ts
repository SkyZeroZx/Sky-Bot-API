import { Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { StatusDocumentService } from './status-document.service';
import { CreateStatusDocumentDto } from './dto/create-status-document.dto';
import { PageOptionsDto } from '@core/interface/pagination';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User as UserEntity } from '../user/entities/user.entity';
import { Auth, PermissionsDecorator as Permissions, UserDecorator as User } from '@core/decorators';
import { ADMIN, ALL_ROLES, EMPLOYEE, PERMISSIONS } from '@core/config';

@ApiTags('Status Document')
@ApiBearerAuth()
@Controller('status-document')
export class StatusDocumentController {
  private readonly logger = new Logger(StatusDocumentController.name);
  constructor(private readonly statusDocumentService: StatusDocumentService) {}

  @Post()
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Creacion status document inicial' })
  createStatusDocument(@Body() createStatusDocumentDto: CreateStatusDocumentDto) {
    this.logger.log({ message: 'Creando el status document', createStatusDocumentDto });
    return this.statusDocumentService.createStatusDocument(createStatusDocumentDto);
  }

  @Get()
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Obtener los status document paginados' })
  getStudentDocument(@Query() pageOptionsDto: PageOptionsDto) {
    this.logger.log({ message: 'Obteniendo paginado status document', pageOptionsDto });
    return this.statusDocumentService.getStudentDocument(pageOptionsDto);
  }

  @Get('status-document-dni')
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Obtener lista de tramites del estudiante por DNI en el JWT' })
  getStatusDocumentByDni(@User() user: UserEntity) {
    return this.statusDocumentService.getStatusDocumentByDni(user.dni);
  }

  @Get(':idStatusDocument')
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Obtener detalle de un status document por idStatusDocument' })
  getStatusDocumentById(@Param('idStatusDocument') idStatusDocument: string) {
    this.logger.log(`Obteniendo status document: ${idStatusDocument}`);
    return this.statusDocumentService.getStatusDocumentById(idStatusDocument);
  }
}
