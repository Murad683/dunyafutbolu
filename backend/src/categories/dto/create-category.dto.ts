import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'premier-league' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Premier League' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the parent category' })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
