import { HttpService } from '@nestjs/axios';
import { ProductService } from './product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should call httpService.get with correct URL', async () => {
      mockHttpService.get.mockReturnValueOnce(of({ data: [] } as any));
      await service.findAll();
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://inventory-service:3001/products',
      );
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should return an array of products', async () => {
      const mockProducts = [];
      mockHttpService.get.mockReturnValueOnce(
        of({ data: mockProducts } as any),
      );
      const resolve = await service.findAll();
      expect(resolve).toEqual(mockProducts);
    });

    it('should throw an error with server running', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: null,
        },
      } as any;

      mockHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.findAll()).rejects.toThrow(
        'Could not fetch products',
      );
    });

    it('should throw an error with server down', async () => {
      const axiosError = {
        request: {},
      } as any;

      mockHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.findAll()).rejects.toThrow(
        'Inventory service unavailable',
      );
    });
  });

  describe('findOne', () => {
    it('should call httpService.get with correct URL', async () => {
      const productId = '1';
      mockHttpService.get.mockReturnValueOnce(of({ data: {} } as any));
      await service.findOne(productId);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `http://inventory-service:3001/products/${productId}`,
      );
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should return a product', async () => {
      const productId = '1';
      const mockProduct = {
        id: 1,
        name: 'MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 1000,
        stock: 50,
      };
      mockHttpService.get.mockReturnValueOnce(of({ data: mockProduct } as any));
      const resolve = await service.findOne(productId);
      expect(resolve).toEqual(mockProduct);
    });

    it('should throw an error if product not found', async () => {
      const productId = '999';
      const axiosError = {
        response: {
          status: 404,
          data: null,
        },
      } as any;
      mockHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.findOne(productId)).rejects.toThrow(
        `Product with ID ${productId} not found`,
      );
    });

    it('should throw an error with server down', async () => {
      const productId = '1';
      const axiosError = {
        request: {},
      } as any;

      mockHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.findOne(productId)).rejects.toThrow(
        'Inventory service unavailable',
      );
    });
  });

  describe('createProduct', () => {
    it('should call httpService.post with correct URL and data', async () => {
      const newProduct = {
        name: 'iPhone Air',
        description: 'new easyly way to get money',
        price: '800',
        stock: '100',
      } as any;
      mockHttpService.post.mockReturnValueOnce(of({ data: {} } as any));
      await service.createProduct(newProduct);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://inventory-service:3001/products',
        newProduct,
      );
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    });

    it('should return the created product', async () => {
      const newProduct = {
        name: 'iPhone Air',
        description: 'new easyly way to get money',
        price: '800',
        stock: '100',
      } as any;
      const mockCreatedProduct = {
        id: 2,
        ...newProduct,
      };
      mockHttpService.post.mockReturnValueOnce(
        of({ data: mockCreatedProduct } as any),
      );
      const resolve = await service.createProduct(newProduct);
      expect(resolve).toEqual(mockCreatedProduct);
    });

    it('should throw an error if creation fails', async () => {
      const newProduct = {
        name: 'iPhone Air',
        description: 'new easyly way to get money',
        price: '800',
        stock: '100',
      } as any;
      const axiosError = {
        response: {
          status: 400,
          data: null,
        },
      } as any;
      mockHttpService.post.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.createProduct(newProduct)).rejects.toThrow(
        'Could not create product',
      );
    });

    it('should throw an error with server down', async () => {
      const newProduct = {
        name: 'iPhone Air',
        description: 'new easyly way to get money',
        price: '800',
        stock: '100',
      } as any;
      const axiosError = {
        request: {},
      } as any;

      mockHttpService.post.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.createProduct(newProduct)).rejects.toThrow(
        'Inventory service unavailable',
      );
    });
  });

  describe('updateProduct', () => {
    it('should call httpService.patch with correct URL and data', async () => {
      const productId = '1';
      const updateData = {
        price: '900',
      } as any;
      mockHttpService.patch.mockReturnValueOnce(of({ data: {} } as any));
      await service.updateProduct(productId, updateData);
      expect(mockHttpService.patch).toHaveBeenCalledWith(
        `http://inventory-service:3001/products/${productId}`,
        updateData,
      );
      expect(mockHttpService.patch).toHaveBeenCalledTimes(1);
    });

    it('should return the updated product', async () => {
      const productId = '1';
      const updateData = {
        price: '900',
      } as any;
      const mockUpdatedProduct = {
        id: 1,
        name: 'MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 900,
        stock: 50,
      };
      mockHttpService.patch.mockReturnValueOnce(
        of({ data: mockUpdatedProduct } as any),
      );
      const resolve = await service.updateProduct(productId, updateData);
      expect(resolve).toEqual(mockUpdatedProduct);
    });

    it('should throw an error if update fails', async () => {
      const axiosError = {
        response: {
          status: 400,
          data: null,
        },
      } as any;
      const productId = '1';
      const updateData = {
        price: '900',
      } as any;
      mockHttpService.patch.mockReturnValueOnce(throwError(() => axiosError));
      await expect(
        service.updateProduct(productId, updateData),
      ).rejects.toThrow(`Could not update product with ID ${productId}`);
    });

    it('should throw an error with server down', async () => {
      const axiosError = {
        request: {},
      } as any;
      const productId = '1';
      const updateData = {
        price: '900',
      } as any;

      mockHttpService.patch.mockReturnValueOnce(throwError(() => axiosError));
      await expect(
        service.updateProduct(productId, updateData),
      ).rejects.toThrow('Inventory service unavailable');
    });
  });

  describe('deleteProduct', () => {
    it('should call httpService.delete with correct URL', async () => {
      const productId = '1';
      mockHttpService.delete.mockReturnValueOnce(of({ data: {} } as any));
      await service.deleteProduct(productId);
      expect(mockHttpService.delete).toHaveBeenCalledWith(
        `http://inventory-service:3001/products/${productId}`,
      );
      expect(mockHttpService.delete).toHaveBeenCalledTimes(1);
    });

    it('should return the deleted product', async () => {
      const productId = '1';
      const mockDeletedProduct = {
        id: 1,
        name: 'MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 1000,
        stock: 50,
      };
      mockHttpService.delete.mockReturnValueOnce(
        of({ data: mockDeletedProduct } as any),
      );
      const resolve = await service.deleteProduct(productId);
      expect(resolve).toEqual(mockDeletedProduct);
    });

    it('should throw an error if delete fails', async () => {
      const axiosError = {
        response: {
          status: 400,
          data: null,
        },
      } as any;
      const productId = '1';
      mockHttpService.delete.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.deleteProduct(productId)).rejects.toThrow(
        `Could not delete product with ID ${productId}`,
      );
    });

    it('should throw an error with server down', async () => {
      const axiosError = {
        request: {},
      } as any;
      const productId = '1';

      mockHttpService.delete.mockReturnValueOnce(throwError(() => axiosError));
      await expect(service.deleteProduct(productId)).rejects.toThrow(
        'Inventory service unavailable',
      );
    });
  });
});
