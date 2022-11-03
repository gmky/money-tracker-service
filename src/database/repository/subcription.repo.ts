import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcription } from '../entities';

@Injectable()
export class SubcriptionRepo {
  constructor(
    @InjectRepository(Subcription)
    private readonly subs: Repository<Subcription>,
  ) {}
}
