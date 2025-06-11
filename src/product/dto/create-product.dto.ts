import { Category } from 'src/category/interfaces/category.interface';
import { Product } from '../interfaces/product.interface';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly masterProduct?: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  readonly image?: string;

  readonly variationAttributes: { [key: string]: string };

  @IsNumber()
  @Min(0)
  readonly listPrice: number;

  @IsNumber()
  @Min(0)
  readonly salesPrice: number;

  @IsNumber()
  @Min(0)
  readonly stock?: number;

  readonly productType?: 'master' | 'variant' | 'composed';

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  readonly composed?: { category: Category; product: Product }[][];
}
