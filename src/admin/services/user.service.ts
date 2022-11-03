import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/database/entities';
import { UserRepo } from 'src/database/repository';
import { PaginatedResDto } from 'src/shared/dto';
import {
  AdminCreateUserReqDto,
  AdminFilterUserReqDto,
  AdminUpdateUserReqDto,
} from '../dto/req';

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
    Object.assign(existed, data);
    this.userRepo.save(existed);
  }

  async filter(data: AdminFilterUserReqDto): Promise<PaginatedResDto<User>> {
    const { page, size } = data;
    const [total, result] = await this.userRepo.filter(data);
    const parsedResult = instanceToPlain(result) as User[];
    return new PaginatedResDto(total, parsedResult, { page, size });
  }
}
