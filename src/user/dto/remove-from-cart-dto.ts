import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;
}
