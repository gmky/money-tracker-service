import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import {
  PaymentOptionEnum,
  SubscriptionStatusEnum,
  UserPlanEnum,
} from 'src/shared/enum';

export class AdminFilterSubcriptionReqDto {
  @Transform(({ value }) => [value].flat())
  @ApiProperty({ enum: UserPlanEnum, isArray: true })
  @IsEnum(UserPlanEnum, { each: true })
  plan: UserPlanEnum[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  userId: number;

  @Transform(({ value }) => [value].flat())
  @ApiProperty({ enum: SubscriptionStatusEnum, isArray: true })
  @IsEnum(SubscriptionStatusEnum, { each: true })
  status: SubscriptionStatusEnum[];

  @Transform(({ value }) => [value].flat())
  @ApiProperty({ enum: PaymentOptionEnum, isArray: true })
  @IsEnum(PaymentOptionEnum, { each: true })
  paymentOption: PaymentOptionEnum[];
}
