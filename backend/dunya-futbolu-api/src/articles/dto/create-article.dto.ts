import { IsString, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() image: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() excerpt: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) body: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() views?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() readTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
  @ApiProperty({ description: 'Category ID' }) @IsNumber() categoryId: number;
}
