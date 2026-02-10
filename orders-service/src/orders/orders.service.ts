import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Order } from './ordersModel';
import { CreateOrderDto } from './dto/createDto';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateOrderDto } from './dto/updateDto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async onModuleInit() {
    this.orders = this.initialsOrders();
    try {
      await this.rabbitClient.connect();
    } catch (error) {
      console.error('Error initializing orders:', error);
    }
  }

  private generateUniqueNumOrder(existingOrders: Order[]): string {
    let numOrder: string;

    do {
      numOrder = Math.floor(100000 + Math.random() * 900000).toString();
    } while (existingOrders.some((order) => order.numOrder === numOrder));

    return numOrder;
  }

  private getTotalAmount(order: Order): number {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  initialsOrders(): Order[] {
    const items = [
      { productId: '1', quantity: 1, price: 500 },
      { productId: '2', quantity: 2, price: 1000 },
      { productId: '3', quantity: 1, price: 400 },
    ];
    const newOrders: Order[] = [];

    const order1: Order = {
      numOrder: this.generateUniqueNumOrder(newOrders),
      userId: 'testing01',
      items: [items[0], items[1]],
      totalAmount: 2500,
      status: 'delivered',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    order1.totalAmount = this.getTotalAmount(order1);
    newOrders.push(order1);

    const order2: Order = {
      numOrder: this.generateUniqueNumOrder(newOrders),
      userId: 'testing02',
      items: [items[1], items[2]],
      totalAmount: 1900,
      status: 'shipped',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    order2.totalAmount = this.getTotalAmount(order2);
    newOrders.push(order2);
    return newOrders;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(numOrder: string): Order {
    const order = this.orders.find((order) => order.numOrder === numOrder);
    if (!order) {
      throw new NotFoundException('Order ' + numOrder + ' not found');
    }
    return order;
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter((order) => order.status === status);
  }

  createOrder(dto: CreateOrderDto): Order {
    const newOrder: Order = {
      numOrder: this.generateUniqueNumOrder(this.orders),
      userId: dto.userId,
      items: dto.items,
      totalAmount: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    newOrder.totalAmount = this.getTotalAmount(newOrder);
    this.orders.push(newOrder);

    this.rabbitClient.emit('ORDER_CREATED', {
      numOrder: newOrder.numOrder,
      userId: newOrder.userId,
      items: newOrder.items,
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
    });
    return newOrder;
  }

  changeOrderStatus(numOrder: string, dto: UpdateOrderDto): Order {
    const order = this.orders.find((order) => order.numOrder === numOrder);
    if (!order) {
      throw new NotFoundException('Order ' + numOrder + ' not found');
    }

    order.status = dto.status;
    order.updatedAt = new Date();
    this.rabbitClient.emit('ORDER_STATUS_UPDATED', {
      numOrder: order.numOrder,
      status: order.status,
      updatedAt: order.updatedAt,
    });
    return order;
  }
}
