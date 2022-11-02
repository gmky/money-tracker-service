import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class Pageable {
  @ApiProperty()
  @IsPositive()
  page: number;

  @ApiProperty()
  @IsPositive()
  size: number;
}
