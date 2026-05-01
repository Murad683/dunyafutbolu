import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty()
  @IsString()
  playerName: string;

  @ApiProperty()
  @IsString()
  fromClub: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromClubLogo?: string;

  @ApiProperty()
  @IsString()
  toClub: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toClubLogo?: string;

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
