import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
