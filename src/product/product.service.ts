import { Model } from 'mongoose';
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
}
