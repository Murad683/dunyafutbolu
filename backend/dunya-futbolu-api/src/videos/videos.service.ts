import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { YoutubeService } from './youtube.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private repo: Repository<Video>,
    private youtubeService: YoutubeService,
  ) {}

  findAll() {
    return this.repo.find({ order: { date: 'DESC' } });
  }

  async findOne(id: number) {
    const video = await this.repo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async create(dto: CreateVideoDto) {
    const meta = await this.youtubeService.fetchMeta(dto.youtubeUrl);
    const video = this.repo.create({
      youtubeId: meta.youtubeId,
      title: meta.title,
      views: meta.views,
      thumbnailUrl: meta.thumbnailUrl,
      category: dto.category,
    });
    return this.repo.save(video);
  }

  async update(id: number, dto: UpdateVideoDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Video deleted' };
  }
}
