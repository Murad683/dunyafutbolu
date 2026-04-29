import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  image: string;         // URL

  @Column()
  title: string;

  @Column({ default: '' })
  excerpt: string;

  @Column('text', { array: true, default: '{}' })
  body: string[];         // Array of paragraphs

  @Column({ default: '0' })
  views: string;          // e.g. "14.3K"

  @Column({ default: '4 dəq' })
  readTime: string;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Category, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
