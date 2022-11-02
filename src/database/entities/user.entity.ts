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
import { UserStatusEnum } from 'src/shared/enum/user-status.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @Column({ length: 50 })
  firstName: string;

  @ApiProperty()
  @IsAlpha()
  @Column({ length: 50 })
  lastName: string;

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  @Column({ length: 12, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

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
}
