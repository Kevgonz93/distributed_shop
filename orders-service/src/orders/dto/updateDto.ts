import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUSES } from '../ordersModel';
import type { OrderStatus } from '../ordersModel';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  productIds?: string[];

  @IsString()
  @IsNotEmpty()
  @IsIn(ORDER_STATUSES)
  status!: OrderStatus;
}
