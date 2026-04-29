import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './entities/video.entity';
import { YoutubeService } from './youtube.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  providers: [VideosService, YoutubeService],
  controllers: [VideosController],
})
export class VideosModule {}
