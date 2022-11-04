import { Injectable, Logger } from '@nestjs/common';
import { Subscription } from 'src/database/entities';
import { SubscriptionRepo } from 'src/database/repository';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import { AdminFilterSubcriptionReqDto } from '../dto/req';

@Injectable()
export class SubscriptionService {
  private readonly log = new Logger(SubscriptionService.name);

  constructor(private readonly subRepo: SubscriptionRepo) {}

  async filter(
    data: AdminFilterSubcriptionReqDto,
    pageable: Pageable,
  ): Promise<PaginatedResDto<Subscription>> {
    return new PaginatedResDto(0, [], pageable);
  }
}
