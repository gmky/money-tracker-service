import { ApiProperty } from '@nestjs/swagger';

export class OkResDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
