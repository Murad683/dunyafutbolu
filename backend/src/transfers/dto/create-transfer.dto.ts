import { IsString, IsIn, IsOptional, IsNumber } from 'class-validator';
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

  @ApiProperty({ example: 1, description: 'ID of the league category' })
  @IsNumber()
  leagueId: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ enum: ['Daimi Transfer', 'İcarə', 'Mübadilə', 'Digər'] })
  @IsIn(['Daimi Transfer', 'İcarə', 'Mübadilə', 'Digər'])
  type: 'Daimi Transfer' | 'İcarə' | 'Mübadilə' | 'Digər';
}
