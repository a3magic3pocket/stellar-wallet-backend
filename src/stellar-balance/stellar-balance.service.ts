import { Injectable } from "@nestjs/common";
import { AccountResponse } from "@stellar/stellar-sdk/lib/horizon";
import { StellarServerService } from "@src/stellar-server/stellar-server.service";
import { IStellarBalanceListRespDto } from "./interface/stellar-balance-list-resp-dto.interface";

@Injectable()
export class StellarBalanceService {
  private testnetServer;
  constructor(private readonly stellarServerService: StellarServerService) {
    this.testnetServer = this.stellarServerService.getServer("testnet");
  }
  async listTestnetBalances(publicKey: string) {
    const account: AccountResponse =
      await this.testnetServer.loadAccount(publicKey);

    const result: IStellarBalanceListRespDto[] = [];

    for (const row of account.balances) {
      const resultRow: IStellarBalanceListRespDto = {
        balance: row.balance,
        assetType: row.asset_type,
      };

      result.push(resultRow);
    }

    return result;
  }
}
