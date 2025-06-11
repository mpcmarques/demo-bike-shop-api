import { Document } from 'mongoose';
import { Product } from 'src/product/interfaces/product.interface';

export interface ProductCartItem {
  readonly product: Product;
  readonly quantity: number;
  readonly combination?: Product[];
}
export interface Cart {
  items: Array<ProductCartItem>;
  total: number;
}
export interface User extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly address: string;
  readonly floor: string;
  readonly door: string;
  readonly postalCode: string;
  readonly city: string;
  readonly email: string;
  readonly password: string;
  isValidPassword(password: string): Promise<boolean>;
  readonly cart: Cart;
  readonly roles: Array<'admin' | 'user' | 'guest'>;
}
