import { TStellarServerAlias } from "@src/stellar-server/type/stellar-server-alias.type";

export interface IStellarWalletCreateArgs {
  id?: number;
  ownerId: number;
  publicKey: string;
  secret: string;
  network: TStellarServerAlias;
  isActive: number;
  createdAt: Date;
}
