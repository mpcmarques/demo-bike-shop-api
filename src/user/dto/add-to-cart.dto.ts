import { Product } from 'src/product/interfaces/product.interface';

export class AddToCartDto {
  readonly productId: string;
  readonly quantity: number;
  readonly combination?: Product[];
}
