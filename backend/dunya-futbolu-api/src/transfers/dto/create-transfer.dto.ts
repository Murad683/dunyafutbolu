import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty()
  @IsString()
  playerName: string;

  @ApiProperty()
  @IsString()
  fromClub: string;

  @ApiProperty()
  @IsString()
  toClub: string;

  @ApiProperty()
  @IsString()
  fee: string;

  @ApiProperty()
  @IsString()
  league: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ enum: ['giriş', 'çıxış', 'icarə'] })
  @IsIn(['giriş', 'çıxış', 'icarə'])
  type: 'giriş' | 'çıxış' | 'icarə';
}
