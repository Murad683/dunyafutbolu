import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
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

  @Column({ default: 0 })
  views: number;          // changed to number

  @Column()
  readTime: string;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Category, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateReadTime() {
    if (this.body && this.body.length > 0) {
      const text = this.body.join(' ');
      const words = text.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      this.readTime = `${minutes} dəq`;
    } else {
      this.readTime = '1 dəq';
    }
  }
}
