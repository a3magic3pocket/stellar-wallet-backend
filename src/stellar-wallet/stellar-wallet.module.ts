import { Module } from "@nestjs/common";
import { StellarServerModule } from "src/stellar-server/stellar-server.module";
import { StellarWalletService } from "./stellar-wallet.service";
import { StellarWalletController } from "./stellar-wallet.controller";

@Module({
  imports: [StellarServerModule],
  controllers: [StellarWalletController],
  providers: [StellarWalletService],
})
export class StellarWalletModule {}
