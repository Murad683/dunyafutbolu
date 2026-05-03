import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  youtubeId: string;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column({ default: '0' })
  views: string;

  @Column({ default: '' })
  thumbnailUrl: string;

  @CreateDateColumn()
  date: Date;
}
