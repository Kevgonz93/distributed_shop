import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './productModel';

describe('ProductController', () => {
  let productController: ProductController;

  const mockProductService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  } as unknown as jest.Mocked<ProductService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    productController = app.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });
  describe('root', () => {
    it('should be defined', () => {
      expect(productController).toBeDefined();
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const result: Product[] = [];
      mockProductService.findAll.mockResolvedValueOnce(result);
      const reponse = await productController.getProducts();
      expect(mockProductService.findAll).toHaveBeenCalledTimes(1);
      expect(reponse).toBe(result);
    });
  });

  describe('getProductById', () => {
    it('should return a product', async () => {
      const result = {} as Product;
      mockProductService.findOne.mockResolvedValueOnce(result);
      const response = await productController.getProductById('1');
      expect(mockProductService.findOne).toHaveBeenCalledWith('1');
      expect(response).toBe(result);
    });
    it('should throw an error if product not found', async () => {
      mockProductService.findOne.mockRejectedValueOnce(
        new Error('Product with id 999 not found'),
      );
      await expect(productController.getProductById('999')).rejects.toThrow(
        'Product with id 999 not found',
      );
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const result = {} as Product;
      const dto = {
        name: 'test product',
        description: 'test description',
        price: 100,
        stock: 10,
      };
      mockProductService.createProduct.mockResolvedValueOnce(result);
      const response = await productController.createProduct(dto);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(dto);
      expect(response).toBe(result);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const result = {} as Product;
      const dto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 5,
      };
      mockProductService.updateProduct.mockResolvedValueOnce(result);
      const response = await productController.updateProduct('1', dto);
      expect(mockProductService.updateProduct).toHaveBeenCalledWith('1', dto);
      expect(response).toBe(result);
    });
    it('should throw an error if product to update not found', async () => {
      const dto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 5,
      };
      mockProductService.updateProduct.mockRejectedValueOnce(
        new Error('Could not update product with id 999'),
      );
      await expect(productController.updateProduct('999', dto)).rejects.toThrow(
        'Could not update product with id 999',
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete and return a product', async () => {
      const result = {} as Product;
      mockProductService.deleteProduct.mockResolvedValueOnce(result);
      const response = await productController.deleteProduct('1');
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
      expect(response).toBe(result);
    });
    it('should throw an error if product to delete not found', async () => {
      mockProductService.deleteProduct.mockRejectedValueOnce(
        new Error('Could not delete product with id 999'),
      );
      await expect(productController.deleteProduct('999')).rejects.toThrow(
        'Could not delete product with id 999',
      );
    });
  });
});
