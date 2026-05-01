import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private service: ArticlesService) {}

  @Get()
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('categorySlug') categorySlug?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll(categorySlug, search, +(page || 1), +(limit || 10));
  }

  @Get(':idOrSlug') findOne(@Param('idOrSlug') p: string) { return this.service.findOne(p); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post() create(@Body() dto: CreateArticleDto) { return this.service.create(dto); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateArticleDto) { return this.service.update(+id, dto); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}
