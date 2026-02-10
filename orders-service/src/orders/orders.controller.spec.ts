import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('AppController', () => {
  let OrderController: OrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    OrderController = app.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(OrderController).toBeDefined();
  });
});
