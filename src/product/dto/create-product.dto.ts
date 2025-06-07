import { Category } from 'src/category/interfaces/category.interface';
import { Product } from '../interfaces/product.interface';

export class CreateProductDto {
  readonly name: string;
  readonly masterProduct?: string;
  readonly description: string;
  readonly category: string;
  readonly image?: string;
  readonly variationAttributes: { [key: string]: string };
  readonly listPrice: number;
  readonly salesPrice: number;
  readonly stock?: number;
  readonly productType?: 'master' | 'variant' | 'composed';
  readonly label: string;
  readonly composed?: { category: Category; product: Product }[][];
}
