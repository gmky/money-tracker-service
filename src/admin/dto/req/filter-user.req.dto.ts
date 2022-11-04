import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatusEnum } from 'src/shared/enum';

export class AdminFilterUserReqDto {
  @IsOptional()
  @IsAlphanumeric()
  @ApiProperty({ required: false })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @Transform(({ value }) => [value].flatMap((item) => item))
  @ApiProperty({ enum: UserStatusEnum, isArray: true, required: false })
  @IsEnum(UserStatusEnum, { each: true })
  @IsOptional()
  status?: UserStatusEnum[];
}
