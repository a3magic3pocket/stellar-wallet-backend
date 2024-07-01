import { Module } from "@nestjs/common";
import { StellarServerModule } from "src/stellar-server/stellar-server.module";
import { StellarWalletService } from "./stellar-wallet.service";
import { StellarWalletController } from "./stellar-wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StellarWallet } from "./stellar-wallet.entity";
import { StellarWalletRepository } from "./stellar-wallet.repository";

@Module({
  imports: [TypeOrmModule.forFeature([StellarWallet]), StellarServerModule],
  controllers: [StellarWalletController],
  providers: [StellarWalletService, StellarWalletRepository],
})
export class StellarWalletModule {}
