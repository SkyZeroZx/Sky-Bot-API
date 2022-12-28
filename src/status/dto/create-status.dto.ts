import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  idStatusDocument: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @ApiProperty()
  @IsString()
  observations: string;
}
