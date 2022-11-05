import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Plan } from 'src/database/entities';
import { PlanRepo } from 'src/database/repository';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import { CreatePlanReqDto } from '../dto/req/create-plan.req.dto';
import { AdminFilterPlanReqDto } from '../dto/req/filter-plan.req.dto';

@Injectable()
export class PlanService {
  private readonly log = new Logger(PlanService.name);

  constructor(private readonly planRepo: PlanRepo) {}

  create(data: CreatePlanReqDto): Promise<Plan> {
    return this.planRepo.save(data as Plan);
  }

  async filter(
    data: AdminFilterPlanReqDto,
    pageable: Pageable,
  ): Promise<PaginatedResDto<Plan>> {
    const [result, total] = await this.planRepo.filter(data, pageable);
    return new PaginatedResDto(
      total,
      instanceToPlain(result) as Plan[],
      pageable,
    );
  }

  async findById(id: number): Promise<Partial<Plan>> {
    const existed = await this.planRepo.findById(id);
    if (!existed) throw new NotFoundException('Plan not found');
    return instanceToPlain(existed);
  }

  async softRemoveById(id: number): Promise<Plan> {
    return this.planRepo.softRemove(id);
  }
}
