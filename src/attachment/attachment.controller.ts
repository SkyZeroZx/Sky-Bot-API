import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { ADMIN, EMPLOYEE, PERMISSIONS } from '@core/config';
import { Auth, PermissionsDecorator as Permissions } from '@core/decorators';

@ApiTags('Attachment')
@ApiBearerAuth()
@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Registro de nuevo Attachment' })
  registerAttachment(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentService.registerAttachment(createAttachmentDto);
  }

  @Get(':idStatusDocument')
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Obtener Attachment por idStatusDocument' })
  getAttachmentsByIdStatusDocument(@Param('idStatusDocument') idStatusDocument: string) {
    return this.attachmentService.getAttachmentsByIdStatusDocument(idStatusDocument);
  }
}
