export class OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export const ORDER_STATUSES = [
  'pending',
  'shipped',
  'delivered',
  'completed',
  'canceled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class Order {
  numOrder: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
