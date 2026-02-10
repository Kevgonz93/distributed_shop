export interface OrderCreatedEvent {
  numOrder: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  createdAt: string | Date;
}
