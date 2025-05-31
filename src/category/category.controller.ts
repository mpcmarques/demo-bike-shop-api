import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';
import { Public } from 'src/auth/auth.decorators';
import { OnEvent } from '@nestjs/event-emitter';
import { Product } from 'src/product/interfaces/product.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @OnEvent('product.created')
  async handleProductCreated(payload: Product) {
    return this.categoryService.addProductToCategory(payload);
  }
}
