import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post() create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(+id, dto); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}
