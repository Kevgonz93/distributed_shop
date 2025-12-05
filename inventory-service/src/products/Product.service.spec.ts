import { ProductService } from './Product.service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('Service Initialization', () => {
    it('should initialize the service correctly', () => {
      expect(productService).toBeDefined();
    });
  });

  describe('Constructor', () => {
    it('should initialize products array', () => {
      expect(productService['products'].length).toBeGreaterThan(0);
    });
  });

  describe('getLastId', () => {
    it('should return the last product ID', () => {
      const lastId = productService['getLastId']();
      expect(lastId).toBeGreaterThan(0);
    });
    it('should return 0 if no products exist', () => {
      productService['products'] = [];
      const lastId = productService['getLastId']();
      expect(lastId).toBe(0);
    });
  });

  describe('addProduct', () => {
    it('should add a new product and return it', () => {
      const newProductDto = {
        name: 'New Product',
        description: 'none',
        price: 150,
        stock: 50,
      };
      const newProduct = productService.addProduct(newProductDto);
      expect(newProduct).toHaveProperty('id');
      expect(newProduct.name).toBe('New Product');
      expect(newProduct.description).toBe('none');
      expect(newProduct.price).toBe(150);
      expect(newProduct.stock).toBe(50);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const products = productService.getAllProducts();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('getProductById', () => {
    it('should return the correct product for a valid ID', () => {
      const product = productService.getProductById(1);
      expect(product).toEqual({
        id: 1,
        name: 'MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 1000,
        stock: 50,
      });
    });

    it('should throw NotFoundException for an invalid ID', () => {
      expect(() => productService.getProductById(999)).toThrow(
        'Product with ID 999 not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product for a valid ID', () => {
      const newProduct = productService.addProduct({
        name: 'Product A',
        description: 'Description A',
        price: 100,
        stock: 10,
      });
      const lastId = productService['getLastId']();
      const updatedProductResult = productService.updateProduct(lastId, {
        name: 'Updated Product A',
        price: 120,
      });
      expect(updatedProductResult.id).toEqual(newProduct.id);
      expect(updatedProductResult.description).toEqual(newProduct.description);
      expect(updatedProductResult.stock).toEqual(newProduct.stock);
      expect(updatedProductResult.name).toBe('Updated Product A');
      expect(updatedProductResult.price).toBe(120);
    });

    it('should throw NotFoundException for an invalid ID', () => {
      expect(() =>
        productService.updateProduct(999, {
          name: 'Non-existent Product',
          price: 200,
        }),
      ).toThrow('Product with ID 999 not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete and return the product for a valid ID', () => {
      const newProduct = productService.addProduct({
        name: 'Product to Delete',
        description: 'To be deleted',
        price: 50,
        stock: 5,
      });
      const lastId = productService['getLastId']();
      const deletedProduct = productService.deleteProduct(lastId);
      expect(deletedProduct).toEqual(newProduct);
      expect(() => productService.getProductById(lastId)).toThrow(
        'Product with ID ' + lastId + ' not found',
      );
    });

    it('should throw NotFoundException for an invalid ID', () => {
      expect(() => productService.deleteProduct(999)).toThrow(
        'Product with ID 999 not found',
      );
    });
  });
});
