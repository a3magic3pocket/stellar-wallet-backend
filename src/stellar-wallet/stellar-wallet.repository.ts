import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { StellarWallet } from "./stellar-wallet.entity";
import { TStellarServerAlias } from "src/stellar-server/type/stellar-server-alias.type";
import { IStellarWalletSecretRespDto } from "./interface/stellar-wallet-secret-resp-dto.interface";
import { IStellarWalletListRespDto } from "./interface/stellar-wallet-list-resp-dto.interface";

@Injectable()
export class StellarWalletRepository extends Repository<StellarWallet> {
  constructor(dataSource: DataSource) {
    super(StellarWallet, dataSource.createEntityManager());
  }

  async createStellarWallet(wallet: StellarWallet): Promise<StellarWallet> {
    return this.save(wallet);
  }

  async findByOwnerIdAndNetwork(
    ownerId: number,
    network: TStellarServerAlias
  ): Promise<IStellarWalletListRespDto[]> {
    return this.find({
      where: { ownerId, network },
      select: ["publicKey", "isActive", "createdAt"],
    });
  }

  async findOneSecret(
    ownerId: number,
    publicKey: string,
    network: TStellarServerAlias
  ): Promise<IStellarWalletSecretRespDto> {
    return this.findOne({
      where: { ownerId, publicKey, network, isActive: 1 },
      select: ["secret"],
    });
  }
}
