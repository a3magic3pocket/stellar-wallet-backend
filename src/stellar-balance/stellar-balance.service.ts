import { Injectable } from "@nestjs/common";
import { AccountResponse } from "@stellar/stellar-sdk/lib/horizon";
import { StellarServerService } from "src/stellar-server/stellar-server.service";

@Injectable()
export class StellarBalanceService {
  private testnetServer;
  constructor(private readonly stellarServerService: StellarServerService) {
    this.testnetServer = this.stellarServerService.getServer("testnet");
  }
  async listTestnetBalances(publicKey: string) {
    const account: AccountResponse = await this.testnetServer.loadAccount(publicKey);
    
    return account.balances;
  }
}
