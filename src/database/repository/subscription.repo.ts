import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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

  save(sub: Subscription, transaction = true): Promise<Subscription> {
    const entity = this.subs.create(sub);
    return this.subs.save(entity, { transaction });
  }
}
