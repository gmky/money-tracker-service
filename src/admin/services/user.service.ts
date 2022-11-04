import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Subscription, User } from 'src/database/entities';
import { PlanRepo, SubscriptionRepo, UserRepo } from 'src/database/repository';
import { Pageable, PaginatedResDto } from 'src/shared/dto';
import {
  PaymentOptionEnum,
  SubscriptionStatusEnum,
  UserRoleEnum,
} from 'src/shared/enum';
import { DataSource } from 'typeorm';
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
    private readonly subRepo: SubscriptionRepo,
    private readonly ds: DataSource,
  ) {}

  async createUser(body: AdminCreateUserReqDto): Promise<Partial<User>> {
    // Check if username or email is existed in database
    const existed = await this.userRepo.findByUsernameOrEmail(
      body.username,
      body.email,
    );
    if (existed && existed.email === body.email)
      throw new BadRequestException('Email already taken');
    if (existed && existed.username === body.username)
      throw new BadRequestException('Username already taken');

    const qr = this.ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // Prepare user entity from data
      let user = this.userRepo.prepare(body);

      // If USER -> require a subcription
      if (body.role === UserRoleEnum.USER) {
        // Search for current active plan info
        const currentPlan = await this.planRepo.getActivePlanInfo(body.plan);
        if (!currentPlan)
          throw new BadRequestException(`Plan ${body.plan} is unavailable`);

        // Create default subcription for user with provided plan
        let sub = new Subscription();
        sub.startAt = new Date();
        sub.paymentOption = PaymentOptionEnum.MONTHLY;
        sub.plan = currentPlan.name;
        sub.planDetail = currentPlan;
        sub.price = currentPlan.monthlyPrice;
        sub.status = SubscriptionStatusEnum.ACTIVE;

        // Set wallets limit to user
        user.totalWalletLimit = currentPlan.totalWallets;
        user.totalCreditWalletLimit = currentPlan.totalCreditWalletLimit;
        user.totalNormalWalletLimit = currentPlan.totalNormalWalletLimit;
        user.totalSavingsWalletLimit = currentPlan.totalSavingsWalletLimit;
        user = await qr.manager.save(user);

        // Set owner of subcription
        sub.user = user;
        sub = this.subRepo.prepare(sub);
        await qr.manager.save(sub, { reload: false });
      }
      await qr.commitTransaction();
      return instanceToPlain(user);
    } catch (error) {
      this.log.error('Failed to create user with error: ', error);
      await qr.rollbackTransaction();
      throw new InternalServerErrorException('Internal server error');
    } finally {
      await qr.release();
    }
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

  async filter(
    data: AdminFilterUserReqDto,
    pageable: Pageable,
  ): Promise<PaginatedResDto<User>> {
    const [total, result] = await this.userRepo.filter(data, pageable);
    const parsedResult = instanceToPlain(result) as User[];
    return new PaginatedResDto(total, parsedResult, pageable);
  }
}
