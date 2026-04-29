import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CategoriesService } from '../categories/categories.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private repo: Repository<Article>,
    private categoriesService: CategoriesService,
  ) {}

  async findAll(categorySlug?: string) {
    const qb = this.repo.createQueryBuilder('article').leftJoinAndSelect('article.category', 'category').orderBy('article.createdAt', 'DESC');
    if (categorySlug) qb.where('category.slug = :slug', { slug: categorySlug });
    return qb.getMany();
  }

  async findOne(idOrSlug: string) {
    const isNum = !isNaN(+idOrSlug);
    const article = await this.repo.findOne({ where: isNum ? { id: +idOrSlug } : { slug: idOrSlug } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: CreateArticleDto) {
    const category = await this.categoriesService.findOne(dto.categoryId);
    const article = this.repo.create({ ...dto, category });
    return this.repo.save(article);
  }

  async update(id: number, dto: UpdateArticleDto) {
    const article = await this.findOne(String(id));
    if (dto.categoryId) {
      article.category = await this.categoriesService.findOne(dto.categoryId);
    }
    Object.assign(article, dto);
    return this.repo.save(article);
  }

  async remove(id: number) {
    await this.findOne(String(id));
    await this.repo.delete(id);
    return { message: 'Article deleted' };
  }
}
