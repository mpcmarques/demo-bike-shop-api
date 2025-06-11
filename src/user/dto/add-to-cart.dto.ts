import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Product } from 'src/product/interfaces/product.interface';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly quantity: number;

  readonly combination?: Product[];
}
