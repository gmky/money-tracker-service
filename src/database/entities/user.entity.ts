import { ApiProperty } from '@nestjs/swagger';
import { genSaltSync, hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsString,
} from 'class-validator';
import { UserPlanEnum, UserRoleEnum } from 'src/shared/enum';
import { UserStatusEnum } from 'src/shared/enum/user-status.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsAlphanumeric()
  @Column({ length: 255, unique: true })
  username: string;

  @ApiProperty()
  @IsEmail()
  @Column({ length: 255, unique: true })
  email: string;

  @Column()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty()
  @IsAlpha()
  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @ApiProperty()
  @IsAlpha()
  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @ApiProperty({ enum: UserStatusEnum })
  @IsEnum(UserStatusEnum)
  @Column({ length: 12, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;

  @ApiProperty({ enum: UserPlanEnum })
  @IsEnum(UserPlanEnum)
  @Column({ length: 12, default: UserPlanEnum.FREE })
  plan: UserPlanEnum;

  @ApiProperty({ enum: UserRoleEnum })
  @IsEnum(UserRoleEnum)
  @Column({ length: 12, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'tw_limit', default: 0, comment: 'Total wallet limit' })
  totalWalletLimit: number;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: ' tcw_limit',
    default: 0,
    comment: 'Total credit wallet limit',
  })
  totalCreditWalletLimit: number;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'tsw_limit',
    default: 0,
    comment: 'Total savings wallet limit',
  })
  totalSavingsWalletLimit: number;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'tnw_limit',
    default: 0,
    comment: 'Total normal wallet limit',
  })
  totalNormalWalletLimit: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.owner)
  wallets: Wallet[];

  @Exclude({ toPlainOnly: true })
  isPasswordChanged = false;

  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    const salt = genSaltSync();
    this.password = hashSync(this.password, salt);
  }

  @BeforeUpdate()
  beforeUpdate(): void {
    if (this.isPasswordChanged) {
      const salt = genSaltSync();
      this.password = hashSync(this.password, salt);
    }
  }

  isAdmin(): boolean {
    return this.role === UserRoleEnum.ADMIN;
  }

  isStaff(): boolean {
    return this.role === UserRoleEnum.STAFF;
  }

  isUser(): boolean {
    return this.role === UserRoleEnum.USER;
  }

  isFreeUser(): boolean {
    return this.role === UserRoleEnum.USER && this.plan === UserPlanEnum.FREE;
  }

  isStandardUser(): boolean {
    return (
      this.role == UserRoleEnum.USER && this.plan === UserPlanEnum.STANDARD
    );
  }

  isPremiumUser(): boolean {
    return (
      this.role === UserRoleEnum.USER && this.plan === UserPlanEnum.PREMIUM
    );
  }
}
