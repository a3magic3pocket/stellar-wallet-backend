import { Test, TestingModule } from '@nestjs/testing';
import { StellarServerService } from './stellar-server.service';

describe('StellarServerService', () => {
  let service: StellarServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StellarServerService],
    }).compile();

    service = module.get<StellarServerService>(StellarServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
