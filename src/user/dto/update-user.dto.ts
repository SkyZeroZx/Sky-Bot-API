import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(User) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
