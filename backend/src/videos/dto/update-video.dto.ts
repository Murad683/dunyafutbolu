import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}
