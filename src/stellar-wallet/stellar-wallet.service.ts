import { BadRequestException, Injectable } from "@nestjs/common";
import { StellarServerService } from "src/stellar-server/stellar-server.service";
import { Keypair } from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";
import axios from "axios";

@Injectable()
export class StellarWalletService {
  private testnetServer;
  constructor(private readonly stellarServerService: StellarServerService) {
    this.testnetServer = this.stellarServerService.getServer("testnet");
  }

  async createTestnetWallet() {
    // pair 생성
    const pair = Keypair.random();
    console.log("pair.secret()", pair.secret());
    console.log("pair.publicKey()", pair.publicKey());

    // 지갑 생성 및 xlm 지급
    const friendsBotUrl = `${process.env.STELLAR_FRIENDSBOT_URL}?addr=${encodeURIComponent(pair.publicKey())}`;
    try {
      const response = await axios.get(friendsBotUrl);
      console.log("response", response.data);
    } catch (error) {
      console.error(error);
      throw new BadRequestException("wallet creation failed");
    }
  }
}
