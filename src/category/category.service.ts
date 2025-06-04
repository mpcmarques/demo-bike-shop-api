import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from 'src/product/interfaces/product.interface';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_MODEL')
    private categoryModel: Model<Category>,
    private productService: ProductService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name });
  }

  async findCategoryProducts(categoryId: ObjectId, producType?: string) {
    return this.productService.findByCategory(categoryId, producType);
  }

  async addProductToCategory(product: Product): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(product.category, {
      $addToSet: { products: product },
    });
  }

  async removeProductFromCategory(product: Product): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(product.category, {
      $pull: { products: product },
    });
  }

  async search(name: string): Promise<Category[] | null> {
    const query: {
      $text: { $search: string };
    } = { $text: { $search: name } };

    return this.categoryModel.find(query);
  }
}
