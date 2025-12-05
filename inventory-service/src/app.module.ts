import { Module } from '@nestjs/common';
import { ProductController } from './products/Product.controller';
import { ProductService } from './products/Product.service';
// import { PrismaService } from './prisma/prisma.service';
// import { PrismaModule } from './prisma/prisma.module';

@Module({
  //imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
