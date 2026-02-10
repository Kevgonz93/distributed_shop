import { Module } from '@nestjs/common';
import { ProductController } from './products/Product.controller';
import { ProductService } from './products/Product.service';
// import { PrismaService } from './prisma/prisma.service';
// import { PrismaModule } from './prisma/prisma.module';
import { InventoryEventsController } from './events/events.controller';
import { InventoryEventsService } from './events/events.service';
import { productModule } from './products/Product.module';

@Module({
  imports: [productModule],
  controllers: [ProductController, InventoryEventsController],
  providers: [ProductService, InventoryEventsService],
})
export class AppModule {}
