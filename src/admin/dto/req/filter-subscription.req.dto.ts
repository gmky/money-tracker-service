import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import {
  PaymentOptionEnum,
  SubcriptionStatusEnum,
  UserPlanEnum,
} from 'src/shared/enum';

export class AdminFilterSubcriptionReqDto {
  @ApiProperty({ enum: UserPlanEnum })
  @IsEnum(UserPlanEnum)
  plan: UserPlanEnum;

  @ApiProperty()
  @IsPositive()
  userId: number;

  @ApiProperty({ enum: SubcriptionStatusEnum })
  @IsEnum(SubcriptionStatusEnum)
  status: SubcriptionStatusEnum;

  @ApiProperty({ enum: PaymentOptionEnum })
  @IsEnum(PaymentOptionEnum)
  paymentOption: PaymentOptionEnum;
}
