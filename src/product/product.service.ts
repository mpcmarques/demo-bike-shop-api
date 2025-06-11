import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteProductDto } from './dto/delete-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_MODEL')
    private productModel: Model<Product>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);

    const result = await createdProduct.save();

    if (result) {
      this.eventEmitter.emit('product.created', result);
    }

    return result;
  }

  async update(updateProductDto: CreateProductDto) {
    const {
      name,
      label,
      description,
      category,
      variationAttributes,
      listPrice,
      salesPrice,
      stock,
      productType,
      masterProduct,
      composed,
    } = updateProductDto;

    const result = this.productModel.findOneAndUpdate(
      { name: updateProductDto.name },
      {
        name,
        label,
        description,
        category,
        variationAttributes,
        listPrice,
        salesPrice,
        stock,
        productType,
        masterProduct,
        composed,
      },
    );

    return result;
  }

  async delete(deleteProductDto: DeleteProductDto) {
    return this.productModel.findOneAndDelete({ _id: deleteProductDto.id });
  }

  async findAll(limit?: number, skip?: number): Promise<Product[]> {
    const query = this.productModel.find();

    if (limit) query.limit(limit);
    if (skip) query.skip(skip);

    return query.exec();
  }

  async findByName(name: string): Promise<Product | null> {
    let product = await this.productModel
      .findOne({ name })
      .populate('variants')
      .populate('masterProduct')
      .populate({
        path: 'composed',
        populate: [
          {
            path: 'product',
            model: 'Product',
            populate: {
              path: 'variants',
              model: 'Product',
              populate: {
                path: 'masterProduct',
                model: 'Product',
              },
            },
          },
          {
            path: 'category',
            model: 'Category',
          },
        ],
      })
      .exec();

    if (product) {
      let variants = [];

      const productType = product.get('productType') as string;

      if (productType == 'variant' && product.masterProduct) {
        variants = await this.productModel.find({
          masterProduct: product.masterProduct,
        });

        // @ts-ignore
        product = {
          ...product.toObject(),
          // @ts-ignore
          variants: [],
          // @ts-ignore
          masterProduct: {
            // @ts-ignore
            ...product.masterProduct?.toObject(),
            // @ts-ignore
            variants: variants,
          },
        };
      }
    }

    return product;
  }

  async search(
    name: string,
    productType?: string,
    category?: string,
  ): Promise<Product[] | null> {
    const query: {
      $text: { $search: string };
      productType?: string;
      category?: string;
    } = { $text: { $search: name } };

    if (productType) query.productType = productType;
    if (category) query.category = category;

    return this.productModel.find(query);
  }

  async findByCategory(category: ObjectId, productType?: string | string[]) {
    const query: {
      category: ObjectId;
      productType?: string | { $in: string[] };
    } = { category };

    if (productType) {
      if (Array.isArray(productType)) {
        query.productType = { $in: productType };
      } else {
        query.productType = productType;
      }
    }

    return this.productModel.find(query);
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id);
  }

  calculateProductPrice(
    product: Product,
    quantity: number,
    combination?: Product[],
  ) {
    if (combination && combination.length > 0) {
      let price = 0;

      combination.forEach((product) => {
        price += this.calculateProductPrice(product, 1);
      });

      return price * quantity;
    }

    if (product.salesPrice) {
      return product.salesPrice * quantity;
    }

    return product.listPrice * quantity;
  }
}
