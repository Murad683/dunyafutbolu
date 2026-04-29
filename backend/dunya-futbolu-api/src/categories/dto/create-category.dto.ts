import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'premier-league' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Premier League' })
  @IsString()
  label: string;

  @ApiProperty({ enum: ['local', 'world', 'special'] })
  @IsIn(['local', 'world', 'special'])
  leagueType: 'local' | 'world' | 'special';
}
