import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Auth, PermissionsDecorator as Permissions } from '@core/decorators';
import { ADMIN, EMPLOYEE, PERMISSIONS } from '@core/config';

@ApiTags('Document')
@ApiBearerAuth()
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Registro de nuevo documento' })
  createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDocumentDto);
  }

  @Get()
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Obtenemos todos los documentos' })
  getAllDocuments() {
    return this.documentService.getAllDocuments();
  }

  @Get(':name')
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Obtenemos documento por su nombre' })
  getDocumentByName(@Param('name') name: string) {
    return this.documentService.getDocumentByName(name);
  }

  @Patch(':idDocument')
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Actualizamos el documento' })
  updateDocument(
    @Param('idDocument', ParseIntPipe) idDocument: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.updateDocument(idDocument, updateDocumentDto);
  }

  @Delete(':idDocument')
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Eliminamos documento' })
  deleteDocument(@Param('idDocument', ParseIntPipe) idDocument: number) {
    return this.documentService.deleteDocument(idDocument);
  }
}
