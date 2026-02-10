import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/createDto';
import { AxiosError } from 'axios';
import { UpdateOrderDto } from './dto/updateDto';

@Injectable()
export class OrdersService {
  private readonly baseUrl =
    process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';

  private static readonly VALID_STATUSES = [
    'pending',
    'shipped',
    'delivered',
    'canceled',
  ] as const;

  constructor(private readonly httpService: HttpService) {
    console.log('ORDERS baseUrl:', this.baseUrl);
  }

  private handleAxiosError(error: AxiosError, fallbackMessage: string) {
    if (error.response) {
      throw new HttpException(
        error.response.data || fallbackMessage,
        error.response.status,
      );
    }

    throw new HttpException(
      'Order service unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  async createOrder(dto: CreateOrderDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/orders`, dto),
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'Could not create order');
    }
  }

  async getOrders() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/orders`),
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'Could not fetch orders');
    }
  }

  async getOneOrder(numOrder: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/orders/${numOrder}`),
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(
        error as AxiosError,
        `Could not fetch order # ${numOrder}`,
      );
    }
  }

  async changeStatus(numOrder: string, dto: UpdateOrderDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(`${this.baseUrl}/orders/${numOrder}`, {
          status: dto.status,
        }),
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(
        error as AxiosError,
        `Could not update order # ${numOrder}`,
      );
    }
  }

  async getOrdersByStatus(status: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/orders`, {
          params: { status },
        }),
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(
        error as AxiosError,
        `Could not fetch orders with status ${status}`,
      );
    }
  }
}
