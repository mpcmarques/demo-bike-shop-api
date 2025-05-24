import { Document } from 'mongoose';
import { Product } from '../../product/interfaces/product.interface';

export interface Category extends Document {
  readonly name: string;
  readonly description: string;
  readonly products: Array<Product>;
}
