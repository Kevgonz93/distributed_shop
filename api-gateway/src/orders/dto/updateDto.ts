export class UpdateOrderDto {
  userId?: string;
  productIds?: string[];
  status?: 'pending' | 'shipped' | 'delivered' | 'canceled';
}
