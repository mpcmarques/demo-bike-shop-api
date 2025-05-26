import { Document } from 'mongoose';

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
}
