import { Controller, Post } from "@nestjs/common";
import { StellarWalletService } from "./stellar-wallet.service";

@Controller("/stellar")
export class StellarWalletController {
  constructor(private readonly stellarWalletService: StellarWalletService) {}

  @Post("/testnet/wallet")
  async createTestnetWallet() {
    await this.stellarWalletService.createTestnetWallet();

    return "hello";
  }
}
