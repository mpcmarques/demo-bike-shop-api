import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
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

  @Public()
  @Get(':name')
  async findByName(@Param() params: { name: string }) {
    const category = await this.categoryService.findByName(params.name);

    if (!category) throw new NotFoundException();

    return category;
  }

  @OnEvent('product.created')
  async handleProductCreated(payload: Product) {
    return this.categoryService.addProductToCategory(payload);
  }
}
