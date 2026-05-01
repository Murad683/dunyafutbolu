import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './entities/article.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CategoriesModule],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
