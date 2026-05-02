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

  async findAll(categorySlug?: string, search?: string, page = 1, limit = 10) {
    const qb = this.repo.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoin('category.parent', 'parent') // Join parent to check for parent slug
      .orderBy('article.createdAt', 'DESC');

    if (categorySlug) {
      qb.andWhere('(category.slug = :slug OR parent.slug = :slug)', { slug: categorySlug });
    }

    if (search) {
      qb.andWhere('(article.title ILIKE :search OR article.excerpt ILIKE :search)', { search: `%${search}%` });
    }

    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(idOrSlug: string) {
    const isNum = !isNaN(+idOrSlug);
    const article = await this.repo.findOne({ 
      where: isNum ? { id: +idOrSlug } : { slug: idOrSlug },
      relations: ['category', 'category.parent']
    });
    if (!article) throw new NotFoundException('Article not found');
    
    // Increment views in background
    this.repo.increment({ id: article.id }, 'views', 1).catch(err => {
      console.error(`Failed to increment views for article ${article.id}:`, err);
    });

    // Return the object with locally incremented views for immediate UI feedback
    article.views++;
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
