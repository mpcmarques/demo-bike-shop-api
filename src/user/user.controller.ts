import { Controller, Get, Post, Body, Request, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart-dto';
import { Public } from 'src/auth/auth.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('cart')
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.userService.addToCart(req.user.sub, addToCartDto);
  }

  @Delete('cart')
  async removeFromCart(
    @Request() req,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ) {
    return this.userService.removeFromCart(req.user.sub, removeFromCartDto);
  }
}
