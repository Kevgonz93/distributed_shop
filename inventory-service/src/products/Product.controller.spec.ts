import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: typeof mockProductService;

  const mockProductService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const sampleProduct = {
    id: 1,
    name: 'Sample Product',
    description: 'A sample product for testing',
    price: 100,
    stock: 20,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should initialize the controller correctly', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('newProd', () => {
    it('should add a new product and return it', async () => {
      const dto = {
        name: 'Sample Product',
        description: 'A sample product for testing',
        price: 100,
        stock: 20,
      };
      service.addProduct.mockResolvedValue(sampleProduct);
      const result = await controller.newProd(dto);
      expect(service.addProduct).toHaveBeenCalledWith(dto);
      expect(result).toEqual(sampleProduct);
    });
  });

  describe('getAllProd', () => {
    it('should return an array of products', async () => {
      service.getAllProducts.mockResolvedValue([sampleProduct]);
      const result = await controller.getAllProd();
      expect(service.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual([sampleProduct]);
    });
  });

  describe('getOneProd', () => {
    it('should return a product for a valid ID', async () => {
      service.getProductById.mockResolvedValue(sampleProduct);
      const result = await controller.getOneProd(1);
      expect(service.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(sampleProduct);
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      service.getProductById.mockRejectedValue(new NotFoundException());
      await expect(controller.getOneProd(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProd', () => {
    it('should update and return the product for a valid ID', async () => {
      const dto = { price: 150 };
      const updatedProduct = { ...sampleProduct, ...dto };
      service.updateProduct.mockResolvedValue(updatedProduct);
      const result = await controller.updateProd(1, dto);
      expect(service.updateProduct).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      service.updateProduct.mockRejectedValue(new NotFoundException());
      const dto = { price: 150 };
      await expect(controller.updateProd(999, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeProd', () => {
    it('should delete and return the product for a valid ID', async () => {
      service.deleteProduct.mockResolvedValue(sampleProduct);
      const result = await controller.removeProd(1);
      expect(service.deleteProduct).toHaveBeenCalledWith(1);
      expect(result).toEqual(sampleProduct);
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      service.deleteProduct.mockRejectedValue(new NotFoundException());
      await expect(controller.removeProd(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
