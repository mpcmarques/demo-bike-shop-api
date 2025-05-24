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
}
