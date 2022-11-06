import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Subscription } from 'src/database/entities';
import { PlanRepo, SubscriptionRepo, UserRepo } from 'src/database/repository';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import { UserRoleEnum, UserStatusEnum } from 'src/shared/enum';
import {
  AdminCreateSubReqDto,
  AdminFilterSubcriptionReqDto,
  AdminUpdateSubStatusReqDto,
} from '../dto/req';

@Injectable()
export class SubscriptionService {
  private readonly log = new Logger(SubscriptionService.name);

  constructor(
    private readonly subRepo: SubscriptionRepo,
    private readonly planRepo: PlanRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async filter(
    data: AdminFilterSubcriptionReqDto,
    pageable: Pageable,
  ): Promise<PaginatedResDto<Subscription>> {
    const [result, total] = await this.subRepo.filter(data, pageable);
    return new PaginatedResDto(
      total,
      instanceToPlain(result) as Subscription[],
      pageable,
    );
  }

  async findById(id: number): Promise<Partial<Subscription>> {
    const existed = await this.subRepo.findByIdWithUserAndPlan(id);
    if (!existed) throw new NotFoundException('Subscription not found');
    return instanceToPlain(existed);
  }

  async createSub(body: AdminCreateSubReqDto): Promise<Partial<Subscription>> {
    const plan = await this.planRepo.findById(body.planId);
    if (!plan) throw new NotFoundException('Plan not found');
    const user = await this.userRepo.findByIdAndRoleAndStatus(
      body.userId,
      UserRoleEnum.USER,
      UserStatusEnum.ACTIVE,
    );
    if (!user) throw new NotFoundException('User not found');
    let sub = this.subRepo.prepare(body);
    sub.user = user;
    sub.planDetail = plan;
    sub = await this.subRepo.save(sub);
    return instanceToPlain(sub);
  }

  async updateStatusById(
    id: number,
    data: AdminUpdateSubStatusReqDto,
  ): Promise<void> {
    const existed = await this.subRepo.findById(id);
    if (!existed) throw new NotFoundException('Subscription not found');
    existed.status = data.status;
    await this.subRepo.save(existed);
  }

  async softDeleteById(id: number): Promise<void> {
    await this.subRepo.softDeleteById(id);
  }
}
