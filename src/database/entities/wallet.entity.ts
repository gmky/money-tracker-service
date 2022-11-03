import { WalletTypeEnum } from 'src/shared/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: number;

  @Column()
  name: string;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_id_wallets_id_users',
  })
  @ManyToOne(() => User, (user) => user.wallets)
  owner: User;

  @Column({ length: 12, default: WalletTypeEnum.NORMAL })
  type: WalletTypeEnum;

  @Column({ default: 0 })
  balance: number;

  @Column({ name: 'statement_date', nullable: true })
  statementDate: Date;

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({ default: 0 })
  target: number;

  @Column({ name: 'credit_limit', default: 0 })
  creditLimit: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
