import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from 'src/product/interfaces/product.interface';
import { ProductService } from 'src/product/product.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

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

  async findAll(limit?: number, skip?: number): Promise<Category[]> {
    const query = this.categoryModel.find();

    if (limit) {
      query.limit(limit);
    }

    if (skip) {
      query.skip(skip);
    }

    return query.exec();
  }

  async getMenuCategories(): Promise<Category[]> {
    return this.categoryModel
      .find({
        showInMenu: true,
      })
      .exec();
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name });
  }

  async findCategoryProducts(
    categoryId: ObjectId,
    productType?: string | string[],
  ) {
    return this.productService.findByCategory(categoryId, productType);
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

  async update(updateCategoryDto: UpdateCategoryDto) {
    const { name, label, description, showInMenu } = updateCategoryDto;

    const result = this.categoryModel.findOneAndUpdate(
      { name: updateCategoryDto.name },
      {
        name,
        label,
        description,
        showInMenu,
      },
    );

    return result;
  }

  async delete(deleteCategoryDto: DeleteCategoryDto) {
    return this.categoryModel.findOneAndDelete({ _id: deleteCategoryDto.id });
  }
}
