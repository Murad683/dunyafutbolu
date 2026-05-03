import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  youtubeId: string;

  @Column()
  title: string;

  @ManyToOne(() => Category, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  category: Category;

  @Column({ default: '0' })
  views: string;

  @Column({ default: '' })
  thumbnailUrl: string;

  @CreateDateColumn()
  date: Date;
}
