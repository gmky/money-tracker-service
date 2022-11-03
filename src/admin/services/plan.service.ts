import { Injectable, Logger } from '@nestjs/common';
import { Plan } from 'src/database/entities';
import { PlanRepo } from 'src/database/repository';
import { CreatePlanReqDto } from '../dto/req/create-plan.req.dto';

@Injectable()
export class PlanService {
  private readonly log = new Logger(PlanService.name);

  constructor(private readonly planRepo: PlanRepo) {}

  create(data: CreatePlanReqDto): Promise<Plan> {
    return this.planRepo.save(data as Plan);
  }
}
