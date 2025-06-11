import { Model } from 'mongoose';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ProductService } from 'src/product/product.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart-dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private productService: ProductService,
  ) {}

  async create(createProductDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createProductDto);

    return await user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getOne(email: string): Promise<User | null | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findOne(email: string): Promise<User | null | undefined> {
    return this.userModel
      .findOne({ email: email })
      .populate('cart.items.product')
      .populate('cart.items.combination')
      .select('-password -salt')
      .exec();
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const product = await this.productService.findById(addToCartDto.productId);

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    if (product.productType === 'master')
      throw new HttpException(
        'Can`t add master products',
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (product.productType === 'variant' && product.stock === 0)
      throw new HttpException('No stock', HttpStatus.NOT_ACCEPTABLE);

    const user = await this.userModel
      .findById(userId)
      .populate('cart.items.product')
      .populate('cart.items.combination')
      .exec();

    if (!user) return null;

    user.cart.items.push({
      product: product,
      quantity: addToCartDto.quantity || 1,
      combination: addToCartDto.combination,
    });

    let total = 0;

    user.cart.items.forEach((item) => {
      total += this.productService.calculateProductPrice(
        item.product,
        item.quantity,
        item.combination,
      );
    });

    user.cart.total = total;

    return user.save();
  }

  async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto) {
    const product = await this.productService.findById(
      removeFromCartDto.productId,
    );

    if (!product) return null;

    const user = await this.userModel
      .findById(userId)
      .populate('cart.items.product')
      .populate('cart.items.combination')
      .exec();

    if (!user) return null;

    const itemIndex = user.cart.items.findIndex((item) =>
      item.product.equals(product.id),
    );

    if (itemIndex !== -1) {
      user.cart.items.splice(itemIndex, 1);

      let total = 0;

      user.cart.items.forEach((item) => {
        total += this.productService.calculateProductPrice(
          item.product,
          item.quantity,
          item.combination,
        );
      });

      user.cart.total = total;
    }

    return user.save();
  }
}
