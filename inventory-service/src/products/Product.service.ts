import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './productModel';
import { CreateProductDto } from './dto/createDto';
import { UpdateProductDto } from './dto/updateDto';

@Injectable()
export class ProductService {
  private products: Product[] = [];

  constructor() {
    this.products = this.initProducts();
  }

  private initProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 1000,
        stock: 50,
      },
      {
        id: 2,
        name: 'MacBook Pro',
        description: 'Powerful laptop from Apple',
        price: 1500,
        stock: 30,
      },
      {
        id: 3,
        name: 'iPhone 17',
        description: 'Latest smartphone from Apple',
        price: 900,
        stock: 100,
      },
      {
        id: 4,
        name: 'iPhone Pro',
        description: 'Latest Pro smartphone from Apple',
        price: 1100,
        stock: 80,
      },
      {
        id: 5,
        name: 'iPhone Pro Max',
        description: 'Latest Pro Max smartphone from Apple',
        price: 1300,
        stock: 60,
      },
      {
        id: 6,
        name: 'iPhone SE',
        description: 'Affordable smartphone from Apple',
        price: 700,
        stock: 120,
      },
    ];
  }

  private getLastId(): number {
    const lastProduct = this.products[this.products.length - 1];
    if (lastProduct) {
      return lastProduct.id;
    }
    return 0;
  }

  addProduct(dto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.getLastId() + 1,
      ...dto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new NotFoundException('Product with ID ' + id + ' not found');
    }
    return product;
  }

  updateProduct(id: number, dto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      throw new NotFoundException('Product with ID ' + id + ' not found');
    }
    const updatedProduct: Product = {
      ...this.products[productIndex],
      ...dto,
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  deleteProduct(id: number): Product {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      throw new NotFoundException('Product with ID ' + id + ' not found');
    }
    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    return deletedProduct;
  }
}
