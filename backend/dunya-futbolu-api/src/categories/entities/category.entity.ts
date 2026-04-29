import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type LeagueType = 'local' | 'world' | 'special';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: ['local', 'world', 'special'] })
  leagueType: LeagueType;

  // articles relation added after Article entity is created
}
