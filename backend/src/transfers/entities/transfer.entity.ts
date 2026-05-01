import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type TransferType = 'giriş' | 'çıxış' | 'icarə';

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

  @Column({ type: 'enum', enum: ['giriş', 'çıxış', 'icarə'] })
  type: TransferType;

  @CreateDateColumn()
  date: Date;
}
