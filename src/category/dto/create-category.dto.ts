import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly label: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly showInMenu: boolean;
}
