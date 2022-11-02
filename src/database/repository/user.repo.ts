import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatusEnum } from 'src/shared/enum';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findActiveByUsername(username: string): Promise<User> {
    return this.users.findOneBy({ username, status: UserStatusEnum.ACTIVE });
  }

  findByUsername(username: string): Promise<User> {
    return this.users.findOneBy({ username });
  }

  findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.users.findOneBy({ email });
  }

  save(user: User): Promise<User> {
    const entity = this.users.create(user);
    return this.users.save(entity);
  }

  softDelete(id: number): Promise<void> {
    this.users.softDelete({ id });
    return;
  }

  forceDelete(id: number): Promise<void> {
    this.users.delete({ id });
    return;
  }
}
