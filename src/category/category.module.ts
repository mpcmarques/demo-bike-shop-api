import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { categoryProvider } from './category.provider';
import { DatabaseModule } from '../database/database.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...categoryProvider],
})
export class CategoryModule {}
