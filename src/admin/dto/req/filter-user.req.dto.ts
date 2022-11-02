import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsEnum, IsString } from 'class-validator';
import { Pageable } from 'src/shared/dto/pageable.req.dto';
import { UserStatusEnum } from 'src/shared/enum';

export class AdminFilterUserReqDto extends Pageable {
  @ApiProperty()
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @Transform(({ value }) => [value].flatMap((item) => item))
  @ApiProperty({ type: [UserStatusEnum] })
  @IsEnum(UserStatusEnum, { each: true })
  status: UserStatusEnum[];
}
