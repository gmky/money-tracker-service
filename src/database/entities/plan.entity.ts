import { UserPlanEnum } from 'src/shared/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'plans' })
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: UserPlanEnum;

  @Column({ default: 0, comment: 'Monthly price' })
  price: number;

  @Column({ name: 'annual_discount', default: 0 })
  annualDiscount: number;

  @Column({ name: 'tw_limit', default: 0, comment: 'Total wallet limit' })
  totalWallets: number;

  @Column({
    name: 'tcw_limit',
    default: 0,
    comment: 'Total credit wallet limit',
  })
  totalCreditWalletLimit: number;

  @Column({
    name: 'tsw_limit',
    default: 0,
    comment: 'Total savings wallet limit',
  })
  totalSavingsWalletLimit: number;

  @Column({
    name: 'tnw_limit',
    default: 0,
    comment: 'Total normal wallet limit',
  })
  totalNormalWalletLimit: number;

  @Column({ name: 'start_at', comment: 'Start time of plan' })
  startAt: Date;

  @Column({ name: 'end_at', comment: 'End time of plan' })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  isFinished(): boolean {
    const now = new Date();
    return now.getTime() > this.endAt.getTime();
  }

  isActive(): boolean {
    const now = new Date();
    return (
      this.startAt.getTime() <= now.getTime() &&
      this.endAt.getTime() >= now.getTime()
    );
  }
}
