import { Document } from 'mongoose';
import { Category } from 'src/category/interfaces/category.interface';

export interface Product extends Document {
  readonly sku: string;
  readonly masterProduct?: Product;
  readonly name: string;
  readonly description: string;
  readonly image?: string;
  readonly category: string;
  readonly variationAttributes: { [key: string]: string };
  readonly listPrice: number;
  readonly salesPrice: number;
  readonly stock: number;
  readonly composed: { category: Category; product: Product }[][];
}
