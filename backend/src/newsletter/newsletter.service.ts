import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(@InjectRepository(Newsletter) private repo: Repository<Newsletter>) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    const existing = await this.repo.findOne({ where: { email: createNewsletterDto.email } });
    if (existing) {
      throw new ConflictException('Email already subscribed');
    }
    const subscriber = this.repo.create(createNewsletterDto);
    return this.repo.save(subscriber);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const subscriber = await this.repo.findOne({ where: { id } });
    if (!subscriber) throw new NotFoundException('Subscriber not found');
    return subscriber;
  }

  async update(id: number, updateNewsletterDto: UpdateNewsletterDto) {
    await this.findOne(id);
    await this.repo.update(id, updateNewsletterDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Subscriber deleted' };
  }
}
