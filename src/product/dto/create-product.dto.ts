import { Category } from 'src/category/interfaces/category.interface';
import { Product } from '../interfaces/product.interface';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  readonly masterProduct?: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly category: string;

  readonly image?: string;

  readonly variationAttributes: { [key: string]: string };

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly listPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly salesPrice: number;

  readonly stock?: number;

  @IsNotEmpty()
  readonly productType?: 'master' | 'variant' | 'composed';

  @IsNotEmpty()
  @IsString()
  readonly label: string;

  readonly composed?: { category: Category; product: Product }[][];
}
