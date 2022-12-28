import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
