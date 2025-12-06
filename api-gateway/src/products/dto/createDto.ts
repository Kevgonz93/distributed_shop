import { IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
