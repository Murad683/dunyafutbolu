import { Injectable, NotFoundException, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const ROOT_CATEGORIES = [
  { slug: 'olke-futbolu', label: 'Ölkə futbolu' },
  { slug: 'dunya-futbolu', label: 'Dünya futbolu' },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async onModuleInit() {
    for (const root of ROOT_CATEGORIES) {
      const exists = await this.repo.findOne({ where: { slug: root.slug } });
      if (!exists) {
        await this.repo.save(this.repo.create(root));
        this.logger.log(`Seeded root category: ${root.label} (${root.slug})`);
      }
    }
  }

  findAll() {
    return this.repo.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: number) {
    const cat = await this.repo.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  create(dto: CreateCategoryDto) {
    const { parentId, ...rest } = dto;
    const category = this.repo.create({
      ...rest,
      parent: parentId ? { id: parentId } : undefined,
    });
    return this.repo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    
    // Protect root categories from being renamed or slug-changed
    const isRoot = ROOT_CATEGORIES.some(root => root.slug === category.slug);
    if (isRoot && (dto.slug || dto.label)) {
      throw new BadRequestException('Root categories (World/Local Football) cannot be renamed or have their slugs changed');
    }

    const { parentId, ...rest } = dto;
    const updateData: any = { ...rest };
    if (parentId !== undefined) {
      updateData.parent = parentId ? { id: parentId } : null;
    }
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    
    // Protect root categories from deletion
    const isRoot = ROOT_CATEGORIES.some(root => root.slug === category.slug);
    if (isRoot) {
      throw new BadRequestException('Root categories (World/Local Football) cannot be deleted');
    }

    await this.repo.delete(id);
    return { message: 'Category deleted' };
  }
}
