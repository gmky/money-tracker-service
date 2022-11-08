import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 255 })
  icon: string;

  @Column({ default: false })
  visible: boolean;

  @Column()
  plan: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Category, (cat) => cat.children)
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_parent_id_categories_id_categories',
  })
  parent: Category;

  @OneToMany(() => Category, (cat) => cat.parent)
  children: Category[];
}
