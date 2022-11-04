import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { UserPlanEnum } from 'src/shared/enum';

export class AdminFilterPlanReqDto {
  @Transform(({ value }) => [value].flat())
  @ApiProperty({ enum: UserPlanEnum, isArray: true })
  @IsEnum(UserPlanEnum, { each: true })
  name: UserPlanEnum[];
}
