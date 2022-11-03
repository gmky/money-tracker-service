import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(UserPlanEnum)
  @ApiProperty({ enum: UserPlanEnum })
  @Column({ unique: true })
  name: UserPlanEnum;

  @IsNumber()
  @ApiProperty()
  @Column({ name: 'monthly_price', default: 0, comment: 'Monthly price' })
  monthlyPrice: number;

  @IsNumber()
  @ApiProperty()
  @Column({ name: 'annual_price', default: 0 })
  annualPrice: number;

  @IsNumber()
  @ApiProperty()
  @Column({ name: 'lifetime_price', default: 0 })
  lifetimePrice: number;

  @IsNumber()
  @ApiProperty()
  @Column({ name: 'tw_limit', default: 0, comment: 'Total wallet limit' })
  totalWallets: number;

  @IsNumber()
  @ApiProperty()
  @Column({
    name: 'tcw_limit',
    default: 0,
    comment: 'Total credit wallet limit',
  })
  totalCreditWalletLimit: number;

  @IsNumber()
  @ApiProperty()
  @Column({
    name: 'tsw_limit',
    default: 0,
    comment: 'Total savings wallet limit',
  })
  totalSavingsWalletLimit: number;

  @IsNumber()
  @ApiProperty()
  @Column({
    name: 'tnw_limit',
    default: 0,
    comment: 'Total normal wallet limit',
  })
  totalNormalWalletLimit: number;

  @IsDate()
  @ApiProperty()
  @Column({ name: 'start_at', comment: 'Start time of plan' })
  startAt: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false })
  @Column({ name: 'end_at', comment: 'End time of plan', nullable: true })
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
