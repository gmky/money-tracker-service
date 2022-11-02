import { hashSync } from 'bcrypt';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column()
  password: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 12 })
  status: UserStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isPasswordChanged = false;

  @BeforeInsert()
  beforeInsert(): void {
    this.password = hashSync(this.password, 10);
  }

  @BeforeUpdate()
  beforeUpdate(): void {
    if (this.isPasswordChanged) {
      this.password = hashSync(this.password, 10);
    }
  }
}
