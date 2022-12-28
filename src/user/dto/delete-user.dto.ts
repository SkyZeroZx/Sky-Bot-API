import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}
