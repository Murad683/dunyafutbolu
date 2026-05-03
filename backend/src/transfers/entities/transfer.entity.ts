import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export type TransferType = 'Daimi Transfer' | 'İcarə' | 'Mübadilə' | 'Digər';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerName: string;

  @Column()
  fromClub: string;

  @Column({ nullable: true })
  fromClubLogo: string;

  @Column()
  toClub: string;

  @Column({ nullable: true })
  toClubLogo: string;

  @Column({ default: 'N/A' })
  fee: string;

  @ManyToOne(() => Category, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  league: Category;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: ['Daimi Transfer', 'İcarə', 'Mübadilə', 'Digər'],
    default: 'Daimi Transfer',
  })
  type: string;

  @CreateDateColumn()
  date: Date;
}
