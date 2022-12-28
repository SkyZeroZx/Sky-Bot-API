import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, isURL, IsUrl, IS_URL, MaxLength } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(45)
  @IsNotEmpty()
  idStatusDocument: string;

  @ApiProperty()
 
  @IsArray()
  @IsNotEmpty()
  listUrl: string[];
}
