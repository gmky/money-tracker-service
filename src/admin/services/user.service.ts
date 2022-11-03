import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Subcription, User } from 'src/database/entities';
import { PlanRepo, SubcriptionRepo, UserRepo } from 'src/database/repository';
import { PaginatedResDto } from 'src/shared/dto';
import {
  PaymentOptionEnum,
  SubcriptionStatusEnum,
  UserRoleEnum,
} from 'src/shared/enum';
import {
  AdminCreateUserReqDto,
  AdminFilterUserReqDto,
  AdminUpdateUserReqDto,
} from '../dto/req';

@Injectable()
export class UserService {
  private readonly log = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepo,
    private readonly planRepo: PlanRepo,
    private readonly subRepo: SubcriptionRepo,
  ) {}

  async createUser(body: AdminCreateUserReqDto): Promise<Partial<User>> {
    let existed = await this.userRepo.findByEmail(body.email);
    if (existed) throw new BadRequestException('Email already taken');
    existed = await this.userRepo.findByUsername(body.username);
    if (existed) throw new BadRequestException('Username already taken');
    const user = await this.userRepo.save(body as User);
    // If user -> require a subcription
    if (body.role === UserRoleEnum.USER) {
      const currentPlan = await this.planRepo.getActivePlanInfo(body.plan);
      if (!currentPlan)
        throw new BadRequestException(`Plan ${body.plan} is unavailable`);
      const sub = new Subcription();
      sub.startAt = new Date();
      sub.paymentOption = PaymentOptionEnum.MONTHLY;
      sub.plan = currentPlan.name;
      sub.planDetail = currentPlan;
      sub.price = currentPlan.monthlyPrice;
      sub.status = SubcriptionStatusEnum.ACTIVE;
      sub.user = user;
      await this.subRepo.save(sub);
    }
    return instanceToPlain(user);
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
