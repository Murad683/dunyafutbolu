import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type BannerPlacement = 'TOP_728X90' | 'SIDEBAR_300X350';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @Column()
  linkUrl: string;

  @Column({ type: 'enum', enum: ['TOP_728X90', 'SIDEBAR_300X350'] })
  placement: BannerPlacement;

  @Column({ default: true })
  isActive: boolean;
}
