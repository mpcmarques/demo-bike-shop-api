import { Document } from 'mongoose';
import { Product } from '../../product/interfaces/product.interface';

export interface Category extends Document {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly showInMenu: boolean;
  readonly products: Array<Product>;
}
