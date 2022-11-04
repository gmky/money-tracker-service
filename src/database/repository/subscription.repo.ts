import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminFilterSubcriptionReqDto } from 'src/admin/dto/req';
import { Pageable } from 'src/shared/dto';
import { DeepPartial, Equal, In, IsNull, Not, Repository } from 'typeorm';
import { Subscription } from '../entities';

@Injectable()
export class SubscriptionRepo {
  constructor(
    @InjectRepository(Subscription)
    private readonly subs: Repository<Subscription>,
  ) {}

  prepare(data: DeepPartial<Subscription>): Subscription {
    return this.subs.create(data);
  }

  findById(id: number): Promise<Subscription> {
    return this.subs.findOne({
      where: { id },
    });
  }

  save(sub: Subscription, transaction = true): Promise<Subscription> {
    const entity = this.subs.create(sub);
    return this.subs.save(entity, { transaction });
  }

  async filter(
    data: AdminFilterSubcriptionReqDto,
    pageable: Pageable,
  ): Promise<[total: number, result: Subscription[]]> {
    const query = {
      plan: In(data.plan),
      user: { id: data.userId ? Equal(data.userId) : Not(IsNull()) },
      status: In(data.status),
      paymentOption: In(data.paymentOption),
    };

    const total = await this.subs.countBy(query);
    const result = await this.subs.find({
      where: query,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
    });
    return [total, result];
  }
}
