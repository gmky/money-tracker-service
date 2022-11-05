import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Subscription } from 'src/database/entities';

export class AdminCreateSubReqDto extends OmitType(Subscription, [
  'planDetail',
  'user',
  'id',
] as const) {
  @ApiProperty()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsPositive()
  planId: number;
}
