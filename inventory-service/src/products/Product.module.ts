import { Module } from '@nestjs/common';
import { ProductService } from './Product.service';
import { ProductController } from './Product.controller';
//import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  //imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class productModule {}
