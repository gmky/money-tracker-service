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

  findByIdWithUserAndPlan(id: number): Promise<Subscription> {
    return this.subs.findOne({
      select: {
        user: {
          id: true,
          username: true,
          email: true,
        },
        planDetail: {
          id: true,
          name: true,
          monthlyPrice: true,
          annualPrice: true,
          lifetimePrice: true,
          totalCreditWalletLimit: true,
          totalNormalWalletLimit: true,
          totalSavingsWalletLimit: true,
          totalWallets: true,
        },
      },
      where: { id },
      relations: {
        user: true,
        planDetail: true,
      },
    });
  }

  save(sub: Subscription, transaction = true): Promise<Subscription> {
    const entity = this.subs.create(sub);
    return this.subs.save(entity, { transaction });
  }

  async filter(
    data: AdminFilterSubcriptionReqDto,
    pageable: Pageable,
  ): Promise<[result: Subscription[], total: number]> {
    const query = {
      plan: In(data.plan),
      user: { id: data.userId ? Equal(data.userId) : Not(IsNull()) },
      status: In(data.status),
      paymentOption: In(data.paymentOption),
    };

    return this.subs.findAndCount({
      where: query,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
      order: {
        startAt: 'DESC',
      },
    });
  }
}
