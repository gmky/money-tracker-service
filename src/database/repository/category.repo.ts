import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities';

@Injectable()
export class CategoryRepo {
  private readonly log = new Logger(CategoryRepo.name);

  constructor(
    @InjectRepository(CategoryRepo)
    private readonly categories: Repository<Category>,
  ) {}
}
