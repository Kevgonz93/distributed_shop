import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createDto';
import { UpdateOrderDto } from './dto/updateDto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOne(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  getAll(@Query('status') status?: string) {
    if (status) {
      return this.ordersService.getOrdersByStatus(status);
    }
    return this.ordersService.getOrders();
  }

  @Get(':numOrder')
  getOne(@Param('numOrder') numOrder: string) {
    return this.ordersService.getOneOrder(numOrder);
  }

  @Patch(':numOrder')
  updateStatus(
    @Param('numOrder') numOrder: string,
    @Body() updateOrderDto: Partial<UpdateOrderDto>,
  ) {
    return this.ordersService.changeStatus(numOrder, updateOrderDto);
  }
}
