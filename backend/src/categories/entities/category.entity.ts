import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export type CategoryType = 'article' | 'video' | 'league';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: ['article', 'video', 'league'],
    default: 'article',
  })
  type: CategoryType;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
