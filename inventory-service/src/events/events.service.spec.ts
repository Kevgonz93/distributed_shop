import { Test, TestingModule } from '@nestjs/testing';
import { InventoryEventsService } from './events.service';

describe('InventoryEventsService', () => {
  let service: InventoryEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryEventsService],
    }).compile();

    service = module.get<InventoryEventsService>(InventoryEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
