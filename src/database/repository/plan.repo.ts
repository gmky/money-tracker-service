import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminFilterPlanReqDto } from 'src/admin/dto/req/filter-plan.req.dto';
import { Pageable } from 'src/shared/dto';
import { CacheKeyEnum, UserPlanEnum } from 'src/shared/enum';
import { In, LessThanOrEqual, Raw, Repository } from 'typeorm';
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
        endAt: Raw((alias) => `${alias} >= SYSDATE() OR ${alias} IS NULL`),
        name,
      },
      cache: {
        id: `${CacheKeyEnum.PLAN_ACTIVE_PREFIX}-${name.toLowerCase()}`,
        milliseconds: 60000,
      },
    });
  }

  save(data: Plan): Promise<Plan> {
    const entity = this.plans.create(data);
    return this.plans.save(entity);
  }

  async filter(
    data: AdminFilterPlanReqDto,
    pageable: Pageable,
  ): Promise<[result: Plan[], total: number]> {
    const query = {
      name: In(data.name),
    };
    return this.plans.findAndCount({
      where: query,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
    });
  }

  findById(id: number): Promise<Plan> {
    return this.plans.findOne({
      where: { id },
      cache: {
        id: `${CacheKeyEnum.PLAN_DETAIL_PREFIX}-${id}`,
        milliseconds: 600000,
      },
    });
  }

  softRemove(id: number): Promise<Plan> {
    return this.plans.softRemove({ id });
  }
}
