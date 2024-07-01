import { Test, TestingModule } from '@nestjs/testing';
import { StellarWalletController } from './stellar-wallet.controller';

describe('StellarWalletController', () => {
  let controller: StellarWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StellarWalletController],
    }).compile();

    controller = module.get<StellarWalletController>(StellarWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
