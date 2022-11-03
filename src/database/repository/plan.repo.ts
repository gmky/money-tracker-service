import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan, User } from '../entities';

@Injectable()
export class PlanRepo {
  constructor(
    @InjectRepository(Plan) private readonly users: Repository<User>,
  ) {}
}
