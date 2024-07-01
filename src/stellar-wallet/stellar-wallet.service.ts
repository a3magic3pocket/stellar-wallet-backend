import { BadRequestException, Injectable } from "@nestjs/common";
import { StellarServerService } from "src/stellar-server/stellar-server.service";
import { Keypair } from "@stellar/stellar-sdk";
import axios from "axios";
import { IStellarWalletCreateArgs } from "./interface/stellar-wallet-create-args.interface";
import { StellarWalletRepository } from "./stellar-wallet.repository";
import { decryptAES, encrpytAES } from "src/global/crypto/aes";
import { TStellarServerAlias } from "src/stellar-server/type/stellar-server-alias.type";

@Injectable()
export class StellarWalletService {
  private testnetServer;
  constructor(
    private readonly stellarServerService: StellarServerService,
    private readonly stellarWalletRepository: StellarWalletRepository
  ) {
    this.testnetServer = this.stellarServerService.getServer("testnet");
  }

  async createTestnetWallet(ownerId: number) {
    // pair 생성
    const pair = Keypair.random();

    // 지갑 생성 및 xlm 지급
    const friendsBotUrl = `${process.env.STELLAR_FRIENDSBOT_URL}?addr=${encodeURIComponent(pair.publicKey())}`;
    try {
      await axios.get(friendsBotUrl);

      const stellarWalletCreateArgs: IStellarWalletCreateArgs = {
        ownerId,
        publicKey: pair.publicKey(),
        secret: encrpytAES(pair.secret()),
        network: "testnet",
        isActive: 1,
        CreatedAt: new Date(),
      };

      await this.stellarWalletRepository.save(stellarWalletCreateArgs);
    } catch (error) {
      console.error(error);
      throw new BadRequestException("wallet creation failed");
    }
  }

  async listMyWallets(ownerId: number, network: TStellarServerAlias) {
    return await this.stellarWalletRepository.findByOwnerIdAndNetwork(
      ownerId,
      network
    );
  }

  async retrieveSecret(
    ownerId: number,
    publicKey: string,
    network: TStellarServerAlias
  ) {
    const result = await this.stellarWalletRepository.findOneSecret(
      ownerId,
      publicKey,
      network
    );

    if (result && result.secret) {
      result.secret = decryptAES(result.secret);
    }

    return result;
  }
}
