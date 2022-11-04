import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { User } from 'src/database/entities';
import { UserPlanEnum } from 'src/shared/enum';

export class AdminCreateUserReqDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'isPasswordChanged',
  'id',
  'plan',
] as const) {
  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserPlanEnum, required: false })
  @IsOptional()
  @IsEnum(UserPlanEnum)
  plan?: UserPlanEnum;
}
