import { Category } from 'src/category/interfaces/category.interface';
import { Product } from '../interfaces/product.interface';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  readonly masterProduct?: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  readonly image?: string;

  readonly variationAttributes: { [key: string]: string };

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly listPrice: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly salesPrice: number;

  @IsNumber()
  @Min(0)
  readonly stock?: number;

  readonly productType?: 'master' | 'variant' | 'composed';

  readonly label: string;

  readonly composed?: { category: Category; product: Product }[][];
}
