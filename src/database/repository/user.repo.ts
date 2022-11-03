import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminFilterUserReqDto } from 'src/admin/dto/req/filter-user.req.dto';
import { UserStatusEnum } from 'src/shared/enum';
import { In, IsNull, Like, Not, Repository } from 'typeorm';
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

  async filter(
    data: AdminFilterUserReqDto,
  ): Promise<[total: number, result: User[]]> {
    const { page, size } = data;
    const query = {
      username: data.username ? Like(`${data.username}%`) : Not(IsNull()),
      email: data.email ? Like(`${data.email}%`) : Not(IsNull()),
      status: data.status ? In(data.status) : Not(IsNull()),
    };
    console.log(query);
    const total = await this.users.countBy(query);
    const result = await this.users.find({
      where: query,
      skip: (page - 1) * size,
      take: page,
    });
    return [total, result];
  }
}
