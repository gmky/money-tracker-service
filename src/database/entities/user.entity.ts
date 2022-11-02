import { ApiProperty } from '@nestjs/swagger';
import { genSaltSync, hash, hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from 'src/shared/enum/user-status.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 255, unique: true })
  username: string;

  @ApiProperty()
  @Column({ length: 255, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @ApiProperty()
  @Column({ length: 50 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 50 })
  lastName: string;

  @ApiProperty()
  @Column({ length: 12, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
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
}
