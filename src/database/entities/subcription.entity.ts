import {
  PaymentOptionEnum,
  SubcriptionStatusEnum,
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

@Entity({ name: 'subcriptions' })
export class Subcription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plan: UserPlanEnum;

  @Column({ default: SubcriptionStatusEnum.ACTIVE })
  status: SubcriptionStatusEnum;

  @Column({ name: 'start_at' })
  startAt: Date;

  @Column({ name: 'end_at', nullable: true })
  endAt: Date;

  @Column({ default: 0 })
  price: number;

  @Column({ name: 'payment_option', default: PaymentOptionEnum.MONTHLY })
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