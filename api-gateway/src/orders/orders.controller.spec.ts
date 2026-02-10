import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: typeof mockOrdersService;

  const mockOrdersService = {
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOneOrder: jest.fn(),
    changeStatus: jest.fn(),
    getOrdersByStatus: jest.fn(),
  };

  const VALID_STATUSES = [
    'pending',
    'shipped',
    'delivered',
    'cancelled',
  ] as const;

  const mockOrders = [
    {
      id: '123',
      numOrder: 'ORD123',
      productId: 1,
      quantity: 2,
      status: 'pending',
    },
    {
      id: '124',
      numOrder: 'ORD124',
      productId: 2,
      quantity: 1,
      status: 'shipped',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Controller initialization', () => {
    it('should initialize the controller correctly', () => {
      expect(controller).toBeInstanceOf(OrdersController);
    });
  });

  describe('newProd', () => {
    it('should create a new order and return it', async () => {
      const dto = { numOrder: 'ORD123', productId: 1, quantity: 2 };
      const mockResponse = { id: '123', ...dto };
      service.createOrder.mockResolvedValue(mockResponse);
      const result = await controller.createOne(dto);
      expect(service.createOrder).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAll', () => {
    it('should return all orders', async () => {
      service.getOrders.mockResolvedValue(mockOrders);
      const result = await controller.getAll();
      expect(service.getOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });

    it('should return orders filtered by status', async () => {
      const status = 'pending';
      const filteredOrders = mockOrders.filter((o) => o.status === status);
      service.getOrdersByStatus.mockResolvedValue(filteredOrders);
      const result = await controller.getAll(status);
      expect(service.getOrdersByStatus).toHaveBeenCalledWith(status);
      expect(result).toEqual(filteredOrders);
    });
  });

  describe('getOne', () => {
    it('shoyld return a single order by numOrder', async () => {
      const numOrder = 'ORD123';
      const mockResponse = mockOrders[0];
      service.getOneOrder.mockResolvedValue(mockResponse);
      const result = await controller.getOne(numOrder);
      expect(service.getOneOrder).toHaveBeenCalledWith(numOrder);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order and return the updated order', async () => {
      const numOrder = 'ORD123';
      const updateDto = { status: VALID_STATUSES[1] };
      const mockResponse = { ...mockOrders[0], ...updateDto };
      service.changeStatus.mockResolvedValue(mockResponse);
      const result = await controller.updateStatus(numOrder, updateDto);
      expect(service.changeStatus).toHaveBeenCalledWith(numOrder, updateDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
