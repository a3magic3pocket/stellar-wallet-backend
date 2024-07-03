import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TStellarServerAlias } from "@src/stellar-server/type/stellar-server-alias.type";

@Entity()
export class StellarWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  publicKey: string;

  @Column()
  secret: string;

  @Column()
  network: TStellarServerAlias;

  @Column()
  isActive: number;

  @Column()
  createdAt: Date;
}
