import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Full YouTube URL - metadata will be auto-fetched',
  })
  @IsString()
  youtubeUrl: string;

  @ApiProperty({ example: 'Xülasə' })
  @IsString()
  category: string;
}
