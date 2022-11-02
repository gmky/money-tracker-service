import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
