import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderCreatedEvent } from './eventModel';
import { InventoryEventsService } from './events.service';

@Controller()
export class InventoryEventsController {
  private readonly logger = new Logger(InventoryEventsController.name);

  constructor(private readonly eventsService: InventoryEventsService) {}

  @EventPattern('ORDER_CREATED')
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`ORDER_CREATED: ${JSON.stringify(data)}`);
    await this.eventsService.processOrderCreated(data, context);
  }

  // async handleOrderUpdated(@Payload() data: any, @Ctx() context: RmqContext) {
  //   this.logger.log(`ORDER_UPDATED: ${JSON.stringify(data)}`);
  //   await this.eventsService.precessOrderUpdated(data, context);
  // }
}
