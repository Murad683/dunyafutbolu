import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private repo: Repository<Banner>) {}

  create(createBannerDto: CreateBannerDto) {
    const banner = this.repo.create(createBannerDto);
    return this.repo.save(banner);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const banner = await this.repo.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id);
    await this.repo.update(id, updateBannerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Banner deleted' };
  }
}
