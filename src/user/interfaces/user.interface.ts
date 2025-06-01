import { Document } from 'mongoose';
import { Product } from 'src/product/interfaces/product.interface';

export interface Cart {
  items: Array<Product>;
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
  readonly role: string;
  isValidPassword(password: string): Promise<boolean>;
  readonly cart: Cart;
}
