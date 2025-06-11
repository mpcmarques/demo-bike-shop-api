import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';
import { Public } from 'src/auth/auth.decorators';
import { ObjectId } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('menu')
  @Public()
  async getMenuCategories(): Promise<Category[]> {
    return this.categoryService.getMenuCategories();
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ): Promise<Category[]> {
    return this.categoryService.findAll(limit, skip);
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
    @Query('productType') productType: string | string[],
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

  @Public()
  @Get('/search/:name')
  async search(@Param() params: { name: string }): Promise<Category[] | null> {
    return this.categoryService.search(params.name);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Roles(Role.Admin)
  @Put()
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Roles(Role.Admin)
  @Delete()
  async delete(@Body() deleteCategoryDto: DeleteCategoryDto) {
    return this.categoryService.delete(deleteCategoryDto);
  }
}
