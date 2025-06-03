import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findByName(name: string): Promise<Product | null> {
    let product = await this.productModel
      .findOne({ name })
      .populate('masterProduct')
      .exec();

    if (product) {
      let variants = [];

      const productType = product.get('productType') as string;

      if (productType === 'master') {
        variants = await this.productModel.find({ masterProduct: product });

        product = {
          ...product.toObject(),
          // @ts-ignore
          variants: variants,
        };
      } else if (productType == 'variant' && product.masterProduct) {
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

  async search(name: string, productType?: string): Promise<Product[] | null> {
    const query: {
      $text: { $search: string };
      productType?: string;
    } = { $text: { $search: name } };

    if (productType) query.productType = productType;

    return this.productModel.find(query);
  }

  async findByCategory(category: ObjectId, productType?: string) {
    const query: { category: ObjectId; productType?: string } = { category };

    if (productType) query.productType = productType;

    return this.productModel.find(query);
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id);
  }
}
