import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column()
  league: string;

  @Column()
  image: string;

  @Column({ type: 'enum', enum: ['Daimi Transfer', 'İcarə', 'Mübadilə', 'Digər'] })
  type: TransferType;

  @CreateDateColumn()
  date: Date;
}
