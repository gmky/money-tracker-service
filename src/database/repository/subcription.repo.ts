import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Subcription } from '../entities';

@Injectable()
export class SubcriptionRepo {
  constructor(
    @InjectRepository(Subcription)
    private readonly subs: Repository<Subcription>,
  ) {}

  prepare(data: DeepPartial<Subcription>): Subcription {
    return this.subs.create(data);
  }

  save(sub: Subcription, transaction = true): Promise<Subcription> {
    const entity = this.subs.create(sub);
    return this.subs.save(entity, { transaction });
  }
}
