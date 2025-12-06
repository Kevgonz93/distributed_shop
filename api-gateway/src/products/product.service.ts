import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Product } from './productModel';
import { CreateProductDto } from './dto/createDto';
import { UpdateProductDto } from './dto/updateDto';
import { AxiosError } from 'axios';

@Injectable()
export class ProductService {
  constructor(private readonly http: HttpService) {}
  private readonly inventoryServiceUrl = 'http://inventory-service:3001';

  private handleAxiosError(error: AxiosError, fallbackMessage: string) {
    if (error.response) {
      throw new HttpException(
        error.response.data || fallbackMessage,
        error.response.status,
      );
    }

    throw new HttpException(
      'Inventory service unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  async findAll(): Promise<Product[]> {
    try {
      const response$ = this.http.get(`${this.inventoryServiceUrl}/products`);
      const products = await lastValueFrom(response$);
      return products.data;
    } catch (error) {
      this.handleAxiosError(error, 'Could not fetch products');
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const response$ = this.http.get(
        `${this.inventoryServiceUrl}/products/${id}`,
      );
      const product = await lastValueFrom(response$);
      return product.data;
    } catch (error) {
      this.handleAxiosError(error, `Product with ID ${id} not found`);
    }
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const response$ = this.http.post(
        `${this.inventoryServiceUrl}/products`,
        data,
      );
      const product = await lastValueFrom(response$);
      return product.data;
    } catch (error) {
      this.handleAxiosError(error, 'Could not create product');
    }
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      const response$ = this.http.patch(
        `${this.inventoryServiceUrl}/products/${id}`,
        data,
      );
      const product = await lastValueFrom(response$);
      return product.data;
    } catch (error) {
      this.handleAxiosError(error, `Could not update product with ID ${id}`);
    }
  }

  async deleteProduct(id: string): Promise<Product> {
    try {
      const response$ = this.http.delete(
        `${this.inventoryServiceUrl}/products/${id}`,
      );
      const result = await lastValueFrom(response$);
      return result.data;
    } catch (error) {
      this.handleAxiosError(error, `Could not delete product with ID ${id}`);
    }
  }
}
