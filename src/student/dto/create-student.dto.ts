import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  idStudent: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @IsNotEmpty()
  caracterValidation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  @IsNotEmpty()
  dni: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
