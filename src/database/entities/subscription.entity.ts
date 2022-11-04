import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import {
  PaymentOptionEnum,
  SubscriptionStatusEnum,
  UserPlanEnum,
} from 'src/shared/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { User } from './user.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @IsPositive()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: UserPlanEnum })
  @Column({ length: 12 })
  plan: UserPlanEnum;

  @ApiProperty({ enum: SubscriptionStatusEnum })
  @Column({ length: 12, default: SubscriptionStatusEnum.ACTIVE })
  status: SubscriptionStatusEnum;

  @ApiProperty()
  @Column({ name: 'start_at' })
  startAt: Date;

  @ApiProperty()
  @Column({ name: 'end_at', nullable: true })
  endAt: Date;

  @ApiProperty()
  @Column({ default: 0 })
  price: number;

  @ApiProperty({ enum: PaymentOptionEnum })
  @Column({
    length: 12,
    name: 'payment_option',
    default: PaymentOptionEnum.MONTHLY,
  })
  paymentOption: PaymentOptionEnum;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_id_subcriptions_id_users',
  })
  user: User;

  @ManyToOne(() => Plan)
  @JoinColumn({
    name: 'plan_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_plan_id_subcriptions_id_plans',
  })
  planDetail: Plan;
}
