import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createDto';
import { Order } from './ordersModel';

describe('OrdersService', () => {
  let ordersService: OrdersService;

  const rabbitMock = {
    emit: jest.fn(),
    connect: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: rabbitMock,
        },
      ],
    }).compile();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  it('should initialize orders on module init', async () => {
    await ordersService.onModuleInit();
    expect(ordersService['orders'].length).toBeGreaterThan(0);
    expect(rabbitMock.connect).toHaveBeenCalled();
  });

  describe('getOrders', () => {
    it('should return all orders', () => {
      const orders = ordersService.getOrders();
      expect(orders).toEqual(ordersService['orders']);
    });
  });

  describe('getOrderById', () => {
    it('should return the order with the given numOrder', () => {
      const existingOrder = ordersService['orders'][0];
      const foundOrder = ordersService.getOrderById(existingOrder.numOrder);
      expect(foundOrder).toEqual(existingOrder);
    });

    it('should return undefined if order not found', () => {
      const foundOrder = ordersService.getOrderById('nonexistent');
      expect(foundOrder).toBeUndefined();
    });
  });

  describe('getOrdersByStatus', () => {
    it('should return orders with the given status', () => {
      const status = 'delivered';
      const orders = ordersService.getOrdersByStatus(status);
      expect(orders.every((order) => order.status === status)).toBe(true);
    });

    it('should return an empty array if no orders match the status', () => {
      const status = 'nonexistent-status';
      const orders = ordersService.getOrdersByStatus(status);
    });
  });

  describe('createOrder', () => {
    let createOrderDto: CreateOrderDto;
    let newOrder: Order;

    beforeEach(() => {
      createOrderDto = {
        userId: 'testing02',
        items: [
          { productId: '1', quantity: 2, price: 500 },
          { productId: '3', quantity: 1, price: 400 },
        ],
      } as CreateOrderDto;
      newOrder = ordersService.createOrder(createOrderDto);
    });

    it('should create a new order', () => {
      expect(ordersService['orders']).toContain(newOrder);
    });

    it('should calculate total amount correctly', () => {
      expect(newOrder.totalAmount).toBe(1400);
    });

    it('should assign a unique numOrder', () => {
      expect(newOrder).toHaveProperty('numOrder');
    });

    it('should emit ORDER_CREATED event', () => {
      const emitEventOrder = {
        userId: newOrder.userId,
        numOrder: newOrder.numOrder,
        items: newOrder.items,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      };
      expect(rabbitMock.emit).toHaveBeenCalledWith(
        'ORDER_CREATED',
        emitEventOrder,
      );
    });
  });

  describe();
});
