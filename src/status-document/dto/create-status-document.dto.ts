import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStatusDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  idStatusDocument: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  idStudent: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  idDocument: number;
}
