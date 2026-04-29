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
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) { return this.service.findAll(category); }

  @Get(':idOrSlug') findOne(@Param('idOrSlug') p: string) { return this.service.findOne(p); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post() create(@Body() dto: CreateArticleDto) { return this.service.create(dto); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateArticleDto) { return this.service.update(+id, dto); }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}
