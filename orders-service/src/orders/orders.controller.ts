import {
  Controller,
  Query,
  Param,
  Patch,
  Post,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createDto';
import { Order } from './ordersModel';
import { UpdateOrderDto } from './dto/updateDto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private static readonly VALID_STATUSES: Order['status'][] = [
    'pending',
    'shipped',
    'delivered',
    'canceled',
  ];

  @Post()
  async newOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const response: Order = this.ordersService.createOrder(createOrderDto);
    return Promise.resolve(response);
  }

  @Get()
  async findAll(@Query('status') status?: Order['status']): Promise<Order[]> {
    if (status) {
      if (!OrdersController.VALID_STATUSES.includes(status)) {
        throw new BadRequestException(
          `Invalid status: ${status}. Valid values: ${OrdersController.VALID_STATUSES.join(', ')}`,
        );
      }
      const response: Order[] = this.ordersService.getOrdersByStatus(status);
      return Promise.resolve(response);
    }
    return this.ordersService.getOrders();
  }

  @Get(':numOrder')
  async findOne(@Param('numOrder') numOrder: string): Promise<Order> {
    const response = this.ordersService.getOrderById(numOrder);
    return Promise.resolve(response);
  }

  @Patch(':numOrder')
  async updateStatus(
    @Param('numOrder') numOrder: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order[]> {
    const response = this.ordersService.changeOrderStatus(
      numOrder,
      updateOrderDto,
    );
    return Promise.resolve([response]);
  }
}
