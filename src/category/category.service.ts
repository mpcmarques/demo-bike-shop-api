import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from 'src/product/interfaces/product.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_MODEL')
    private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async addProductToCategory(product: Product): Promise<Category | null> {
    console.log(product);

    return this.categoryModel.findByIdAndUpdate(product.category, {
      $addToSet: { products: product },
    });
  }

  async removeProductFromCategory(product: Product): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(product.category, {
      $pull: { products: product },
    });
  }
}
