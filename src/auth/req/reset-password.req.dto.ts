import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordReqDto {
  @ApiProperty()
  password: string;
}
