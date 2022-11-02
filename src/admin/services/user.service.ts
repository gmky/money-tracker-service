import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/database/entities';
import { UserRepo } from 'src/database/repository/user.repo';
import { str } from 'src/shared/utils';
import { AdminCreateUserReqDto } from '../dto/req';
import { AdminUpdateUserReqDto } from '../dto/req/update-user.req.dto';

@Injectable()
export class UserService {
  private readonly log = new Logger(UserService.name);

  constructor(private readonly userRepo: UserRepo) {}

  async createUser(body: AdminCreateUserReqDto): Promise<User> {
    let existed = await this.userRepo.findByEmail(body.email);
    if (existed) throw new BadRequestException('Email already taken');
    existed = await this.userRepo.findByUsername(body.username);
    if (existed) throw new BadRequestException('Username already taken');
    return this.userRepo.save(body as User);
  }

  async getProfileById(id: number): Promise<Partial<User>> {
    const existed = await this.userRepo.findById(id);
    if (!existed) throw new NotFoundException('User not found');
    return instanceToPlain(existed);
  }

  async softDeleteById(id: number): Promise<void> {
    return this.userRepo.softDelete(id);
  }

  async forceDeleteById(id: number): Promise<void> {
    return this.userRepo.forceDelete(id);
  }

  async updateById(id: number, data: AdminUpdateUserReqDto): Promise<void> {
    const existed = await this.userRepo.findById(id);
    if (!existed) throw new NotFoundException('User not found');
    existed.email = data.email;
    existed.firstName = data.firstName;
    existed.lastName = data.lastName;
    this.userRepo.save(existed);
  }
}
