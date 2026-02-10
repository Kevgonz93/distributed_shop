import { IsString, IsNotEmpty, Min, IsInt } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  @Min(1)
  quantity: number;
  @IsNotEmpty()
  @IsInt()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  userId: string;
  @IsNotEmpty()
  items: OrderItemDto[];
}
