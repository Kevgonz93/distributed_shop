import { Injectable, Logger } from '@nestjs/common';
import { Ctx, RmqContext } from '@nestjs/microservices';
import { OrderCreatedEvent } from './eventModel';
import { Channel } from 'amqplib';

@Injectable()
export class InventoryEventsService {
  private readonly logger = new Logger(InventoryEventsService.name);

  processOrderCreated(data: OrderCreatedEvent, @Ctx() context: RmqContext) {
    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // Simulate inventory update logic
    this.logger.log(`Processing inventory for order ID: ${data.numOrder}`);

    // Acknowledge the message after processing
    channel.ack(originalMsg);
  }

  // precessOrderUpdated(data: any, @Ctx() context: RmqContext) {
  //   const channel: Channel = context.getChannelRef();
  //   const originalMsg = context.getMessage();

  //   // Simulate inventory update logic for order updates
  //   this.logger.log(
  //     `Processing inventory update for order ID: ${data.numOrder}`,
  //   );

  //   // Acknowledge the message after processing
  //   channel.ack(originalMsg);
  // }
}
