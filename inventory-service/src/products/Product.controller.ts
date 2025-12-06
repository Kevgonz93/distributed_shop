import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './Product.service';
import { UpdateProductDto } from './dto/updateDto';
import { CreateProductDto } from './dto/createDto';
import { Product } from './productModel';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  newProd(@Body() dto: CreateProductDto): Product {
    return this.productService.addProduct(dto);
  }

  @Get()
  getAllProd(): Product[] {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getOneProd(@Param('id', ParseIntPipe) id: number): Product {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  updateProd(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Product {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  removeProd(@Param('id', ParseIntPipe) id: number): Product {
    return this.productService.deleteProduct(id);
  }
}
