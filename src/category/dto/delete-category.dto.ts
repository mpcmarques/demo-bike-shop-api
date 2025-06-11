import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
