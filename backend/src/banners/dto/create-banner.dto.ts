import { IsString, IsBoolean, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  linkUrl: string;

  @ApiProperty({ enum: ['TOP_728X90', 'SIDEBAR_300X350'] })
  @IsIn(['TOP_728X90', 'SIDEBAR_300X350'])
  placement: 'TOP_728X90' | 'SIDEBAR_300X350';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
