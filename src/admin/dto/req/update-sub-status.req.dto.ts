import { PickType } from '@nestjs/swagger';
import { Subscription } from 'src/database/entities';

export class AdminUpdateSubStatusReqDto extends PickType(Subscription, [
  'status',
] as const) {}
