import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from 'src/database/entities';

export class AdminCreateUserReqDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'isPasswordChanged',
  'id',
] as const) {
  @ApiProperty()
  password: string;
}
