import { Injectable, BadRequestException } from "@nestjs/common";
import * as StellarSdk from "@stellar/stellar-sdk";
import { TStellarServerAlias } from "./type/stellar-server-alias.type";

@Injectable()
export class StellarServerService {
  private testnetServer;
  constructor() {
    this.testnetServer = new StellarSdk.Horizon.Server(
      process.env.STELLAR_TESTNET_URL
    );
  }

  getServer(alias: TStellarServerAlias) {
    if (alias === "testnet") {
      return this.testnetServer;
    }

    throw new BadRequestException("stellar server alias not allowed");
  }
}
