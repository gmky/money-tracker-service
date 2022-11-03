import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPlanEnum } from 'src/shared/enum';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Plan } from '../entities';

@Injectable()
export class PlanRepo {
  constructor(
    @InjectRepository(Plan) private readonly plans: Repository<Plan>,
  ) {}

  getActivePlanInfo(name: UserPlanEnum): Promise<Plan> {
    const now = new Date();
    return this.plans.findOne({
      where: {
        startAt: LessThanOrEqual(now),
        endAt: MoreThanOrEqual(now),
        name,
      },
    });
  }
}
