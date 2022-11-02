import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginReqDto {
  @ApiProperty()
  @IsString()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
