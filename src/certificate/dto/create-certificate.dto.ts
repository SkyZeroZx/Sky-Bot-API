import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idStatusDocument: string;
}
