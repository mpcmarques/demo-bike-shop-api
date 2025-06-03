import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';
import { Public } from 'src/auth/auth.decorators';
import { ObjectId } from 'mongoose';

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

  @Public()
  @Get(':name/products')
  async findCategoryProductsByName(
    @Param() params: { name: string },
    @Query('productType') productType: string,
  ) {
    const category = await this.categoryService.findByName(params.name);

    if (!category) throw new NotFoundException();

    const products = await this.categoryService.findCategoryProducts(
      category._id as ObjectId,
      productType,
    );

    if (!category) throw new NotFoundException();

    return { category, products };
  }

  // @OnEvent('product.created')
  // async handleProductCreated(payload: Product) {
  //   return this.categoryService.addProductToCategory(payload);
  // }
}
