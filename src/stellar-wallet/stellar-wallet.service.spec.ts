import { Test, TestingModule } from '@nestjs/testing';
import { StellarWalletService } from './stellar-wallet.service';

describe('StellarWalletService', () => {
  let service: StellarWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StellarWalletService],
    }).compile();

    service = module.get<StellarWalletService>(StellarWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
