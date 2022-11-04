import { Injectable, Logger } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Plan } from 'src/database/entities';
import { PlanRepo } from 'src/database/repository';
import { PaginatedResDto } from 'src/shared/dto';
import { CreatePlanReqDto } from '../dto/req/create-plan.req.dto';
import { AdminFilterPlanReqDto } from '../dto/req/filter-plan.req.dto';

@Injectable()
export class PlanService {
  private readonly log = new Logger(PlanService.name);

  constructor(private readonly planRepo: PlanRepo) {}

  create(data: CreatePlanReqDto): Promise<Plan> {
    return this.planRepo.save(data as Plan);
  }

  async filter(data: AdminFilterPlanReqDto): Promise<PaginatedResDto<Plan>> {
    const { page, size } = data;
    const [total, result] = await this.planRepo.filter(data);
    return new PaginatedResDto(total, instanceToPlain(result) as Plan[], {
      page,
      size,
    });
  }
}
