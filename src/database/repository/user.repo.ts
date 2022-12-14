import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminFilterUserReqDto } from 'src/admin/dto/req/filter-user.req.dto';
import { Pageable } from 'src/shared/dto';
import { CacheKeyEnum, UserRoleEnum, UserStatusEnum } from 'src/shared/enum';
import { DeepPartial, In, IsNull, Like, Not, Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findActiveByUsername(username: string): Promise<User> {
    return this.users.findOne({
      where: { username, status: UserStatusEnum.ACTIVE },
      cache: {
        id: `${CacheKeyEnum.USER_BY_USERNAME_PREFIX}-${username}`,
        milliseconds: 60000,
      },
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.users.findOneBy({ username });
  }

  findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  findByIdAndRoleAndStatus(
    id: number,
    role: UserRoleEnum,
    status: UserStatusEnum,
  ): Promise<User> {
    return this.users.findOneBy({ id, role, status });
  }

  findByEmail(email: string): Promise<User> {
    return this.users.findOneBy({ email });
  }

  findByUsernameOrEmail(username: string, email: string): Promise<User> {
    return this.users.findOneBy([{ username }, { email }]);
  }

  prepare(data: DeepPartial<User>): User {
    return this.users.create(data);
  }

  save(user: User, transaction = true): Promise<User> {
    const entity = this.users.create(user);
    return this.users.save(entity, { transaction });
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
    pageable: Pageable,
  ): Promise<[result: User[], total: number]> {
    const query = {
      username: data.username ? Like(`${data.username}%`) : Not(IsNull()),
      email: data.email ? Like(`${data.email}%`) : Not(IsNull()),
      status: data.status ? In(data.status) : Not(IsNull()),
    };
    return this.users.findAndCount({
      where: query,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
    });
  }
}
