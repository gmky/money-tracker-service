import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminFilterPlanReqDto } from 'src/admin/dto/req/filter-plan.req.dto';
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
  ): Promise<[total: number, result: Plan[]]> {
    const { page, size } = data;
    const query = {
      name: In(data.name),
    };
    const total = await this.plans.countBy(query);
    const result = await this.plans.find({
      where: query,
      skip: (page - 1) * size,
      take: size,
    });
    return [total, result];
  }
}
