import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/entities';

export class LoginResDto {
  @ApiProperty({ type: () => User })
  info: Partial<User>;

  @ApiProperty()
  accessToken: string;
}
