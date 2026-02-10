import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosError } from 'axios';

describe('OrdersService', () => {
  let ordersService: OrdersService;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const fakesOrders = [
    { id: '123', numOrder: 'ORD123' },
    { id: '124', numOrder: 'ORD124' },
    { id: '125', numOrder: 'ORD125' },
  ];

  const VALID_STATUSES = [
    'pending',
    'shipped',
    'delivered',
    'canceled',
  ] as const;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('should have a baseUrl', () => {
    it('should have a default baseUrl', () => {
      expect(ordersService['baseUrl']).toBe('http://localhost:3002');
    });

    it('should use environment variable for baseUrl', async () => {
      const originalEnv = process.env.ORDERS_SERVICE_URL;
      process.env.ORDERS_SERVICE_URL = 'http://test-url:4000';

      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [
          OrdersService,
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const serviceWithEnv = moduleRef.get<OrdersService>(OrdersService);
      expect(serviceWithEnv['baseUrl']).toBe('http://test-url:4000');

      process.env.ORDERS_SERVICE_URL = originalEnv;
    });
  });

  describe('handleAxiosError', () => {
    it('should throw HttpException with response data and status', () => {
      const mockError = {
        response: {
          data: 'Error message',
          status: 400,
        },
      } as AxiosError;

      try {
        ordersService['handleAxiosError'](mockError, 'Fallback message');
      } catch (error) {
        expect(error.message).toBe('Error message');
        expect(error.status).toBe(400);
      }
    });

    it('should fallback to generic message if response data is not available', () => {
      const mockError = {
        response: {
          status: 400,
        },
      } as AxiosError;

      try {
        ordersService['handleAxiosError'](mockError, 'Fallback message');
      } catch (error) {
        expect(error.message).toBe('Fallback message');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const dto = { numOrder: 'ORD123', productId: 1, quantity: 2 };
      const mockResponse = { data: { id: '123', ...dto } };
      mockHttpService.post.mockReturnValueOnce(of(mockResponse));
      const result = await ordersService.createOrder(dto);

      expect(result).toEqual(mockResponse.data);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        dto,
      );
    });

    it('should handleAxiosError with a unavilable service', async () => {
      const dto = { numOrder: 'ORD123', productId: 1, quantity: 2 };
      const mockError = new Error('Service Unavailable');
      mockHttpService.post.mockReturnValueOnce({
        toPromise: () => Promise.reject(mockError),
      });

      try {
        await ordersService.createOrder(dto);
      } catch (error) {
        expect(error.message).toBe('Order service unavailable');
        expect(error.status).toBe(503);
      }
    });
  });

  describe('getOrders', () => {
    it('should fetch orders successfully', async () => {
      const mockResponse = { data: [{ id: '123', numOrder: 'ORD123' }] };
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));
      const result = await ordersService.getOrders();

      expect(result).toEqual(mockResponse.data);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
      );
    });

    it('should handleAxiosError with a unavilable service', async () => {
      const mockError = new Error('Service Unavailable');
      mockHttpService.get.mockReturnValueOnce({
        toPromise: () => Promise.reject(mockError),
      });

      try {
        await ordersService.getOrders();
      } catch (error) {
        expect(error.message).toBe('Order service unavailable');
        expect(error.status).toBe(503);
      }
    });
  });

  describe('getOneOrder', () => {
    it('should fetch one order successfully', async () => {
      const mockResponse = { data: fakesOrders[0] };
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      try {
        const result = await ordersService.getOneOrder('ORD123');
        expect(result).toEqual(mockResponse.data);
        expect(mockHttpService.get).toHaveBeenCalledWith(
          expect.stringContaining('/orders/ORD123'),
        );
      } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
      }
    });

    it('should handleAxiosError with a unavilable service', async () => {
      const mockError = new Error('Service Unavailable');
      mockHttpService.get.mockReturnValueOnce({
        toPromise: () => Promise.reject(mockError),
      });

      try {
        await ordersService.getOneOrder('ORD123');
      } catch (error) {
        expect(error.message).toBe('Order service unavailable');
        expect(error.status).toBe(503);
      }
    });
  });

  describe('changeStatus', () => {
    it('should change order status successfully', async () => {
      const dto = { status: VALID_STATUSES[0] };
      const mockResponse = { data: { id: '123', numOrder: 'ORD123', ...dto } };
      mockHttpService.patch.mockReturnValueOnce(of(mockResponse));
      const result = await ordersService.changeStatus('ORD123', dto);

      expect(result).toEqual(mockResponse.data);
      expect(mockHttpService.patch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/ORD123'),
        { status: dto.status },
      );
    });

    it('should handleAxiosError with a unavilable service', async () => {
      const dto = { status: VALID_STATUSES[0] };
      const mockError = new Error('Service Unavailable');
      mockHttpService.patch.mockReturnValueOnce({
        toPromise: () => Promise.reject(mockError),
      });

      try {
        await ordersService.changeStatus('ORD123', dto);
      } catch (error) {
        expect(error.message).toBe('Order service unavailable');
        expect(error.status).toBe(503);
      }
    });

    describe('getOrdersByStatus', () => {
      it('should fetch orders by status successfully', async () => {
        const mockStatus = VALID_STATUSES[0];
        const mockResponse = {
          data: [
            { id: '123', numOrder: 'ORD123', status: mockStatus },
            { id: '124', numOrder: 'ORD124', status: mockStatus },
          ],
        };

        mockHttpService.get.mockReturnValueOnce(of(mockResponse));
        const result = await ordersService.getOrdersByStatus('pending');

        expect(result).toEqual(mockResponse.data);
      });

      it('should handleAxiosError with a unavilable service', async () => {
        const mockError = new Error('Service Unavailable');
        mockHttpService.get.mockReturnValueOnce({
          toPromise: () => Promise.reject(mockError),
        });

        try {
          await ordersService.getOrdersByStatus('pending');
        } catch (error) {
          expect(error.message).toBe('Order service unavailable');
          expect(error.status).toBe(503);
        }
      });
    });
  });
});
