import { ApiProperty } from '@nestjs/swagger';
import { Pageable } from './pageable.req.dto';

export class PaginatedResDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  data: T[];

  constructor(total: number, data: T[], pageable: Pageable) {
    this.total = total;
    this.page = pageable.page;
    this.size = pageable.size;
    this.data = data;
  }
}
