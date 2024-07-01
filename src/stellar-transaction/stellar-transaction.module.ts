import { Module } from "@nestjs/common";
import { StellarTransactionController } from "./stellar-transaction.controller";
import { StellarTransactionService } from "./stellar-transaction.service";
import { StellarServerModule } from "src/stellar-server/stellar-server.module";
import { StellarWalletModule } from "src/stellar-wallet/stellar-wallet.module";

@Module({
  imports: [StellarServerModule, StellarWalletModule],
  controllers: [StellarTransactionController],
  providers: [StellarTransactionService],
})
export class StellarTransactionModule {}
