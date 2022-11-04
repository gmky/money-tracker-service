import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decors';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import { str } from 'src/shared/utils';
import { Subscription } from '../../database/entities';
import { AdminFilterSubcriptionReqDto } from '../dto/req';
import { SubscriptionService } from '../services';

@ApiTags('Admin / Subcription')
@Controller('admin/subcriptions')
export class SubscriptionController {
  private readonly log = new Logger(SubscriptionController.name);

  constructor(private readonly subService: SubscriptionService) {}

  @Public()
  @Get('filter')
  async filter(
    @Query() data: AdminFilterSubcriptionReqDto,
    @Query() pageable: Pageable,
  ): Promise<PaginatedResDto<Subscription>> {
    this.log.debug(
      `Filter subscription with data: ${str(data)} and pagination: ${str(
        pageable,
      )}`,
    );
    return this.subService.filter(data, pageable);
  }
}
