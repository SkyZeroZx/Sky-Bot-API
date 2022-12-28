import { PartialType } from '@nestjs/swagger';
import { CreateStatusDocumentDto } from './create-status-document.dto';

export class UpdateStatusDocumentDto extends PartialType(CreateStatusDocumentDto) {}
