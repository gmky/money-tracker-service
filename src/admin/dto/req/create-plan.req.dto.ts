import { OmitType } from '@nestjs/swagger';
import { Plan } from 'src/database/entities';

export class CreatePlanReqDto extends OmitType(Plan, [
  'createdAt',
  'deletedAt',
  'updatedAt',
  'id',
  'isActive',
  'isFinished',
]) {}
