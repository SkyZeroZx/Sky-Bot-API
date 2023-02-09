import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ReportChart {
  @ApiProperty()
  @IsArray()
  dateRange: string[];
}
