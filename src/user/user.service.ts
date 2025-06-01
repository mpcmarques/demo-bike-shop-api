import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
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

  async findOne(email: string): Promise<User | null | undefined> {
    return this.userModel
      .findOne({ email: email })
      .populate('cart.items')
      .exec();
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const product = await this.productService.findById(addToCartDto.productId);

    if (!product || product.stock <= 0) return null;

    const user = await this.userModel.findById(userId);

    if (!user) return null;

    user.cart.items.push(product);
    user.cart.total = user.cart.total += product.salesPrice;

    return user.save();
  }

  async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto) {
    const product = await this.productService.findById(
      removeFromCartDto.productId,
    );

    if (!product) return null;

    const user = await this.userModel.findById(userId);

    if (!user) return null;

    user.cart.items = user.cart.items.filter((item) => item.equals(product));

    user.cart.total = user.cart.total -= product.salesPrice;

    return user.save();
  }
}
