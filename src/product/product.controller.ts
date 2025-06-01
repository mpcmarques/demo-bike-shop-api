import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';
import { Public } from 'src/auth/auth.decorators';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Roles(Role.Admin)
  @Public()
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Public()
  @Get(':name')
  async findByName(@Param() params: { name: string }): Promise<Product | null> {
    return this.productService.findByName(params.name);
  }
}
