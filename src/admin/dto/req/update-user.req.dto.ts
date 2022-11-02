import { PickType } from '@nestjs/swagger';
import { User } from 'src/database/entities';

export class AdminUpdateUserReqDto extends PickType(User, [
  'email',
  'firstName',
  'lastName',
] as const) {}
