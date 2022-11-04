import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
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
    const [total, result] = await this.subRepo.filter(data, pageable);
    return new PaginatedResDto(
      total,
      instanceToPlain(result) as Subscription[],
      pageable,
    );
  }

  async findById(id: number): Promise<Partial<Subscription>> {
    const existed = await this.subRepo.findById(id);
    if (!existed) throw new NotFoundException('Subscription not found');
    return instanceToPlain(existed);
  }
}
