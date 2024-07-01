import { Injectable } from "@nestjs/common";
import { StellarTransactionSendBody } from "./dto/stellar-transaction-send-body.dto";
import * as StellarSdk from "@stellar/stellar-sdk";
import { StellarServerService } from "src/stellar-server/stellar-server.service";

@Injectable()
export class StellarTransactionService {
  private testnetServer;
  constructor(private readonly stellarServerService: StellarServerService) {
    this.testnetServer = this.stellarServerService.getServer("testnet");
  }

  async sendTestnet(body: StellarTransactionSendBody, depSecret: string) {
    const depAccount = await this.testnetServer.loadAccount(
      body.departurePublicKey
    );

    const depSourceKeys = await StellarSdk.Keypair.fromSecret(depSecret);

    // Start building the transaction.
    const transaction = new StellarSdk.TransactionBuilder(depAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: body.destinationPublicKey,
          // Because Stellar allows transaction in many currencies, you must
          // specify the asset type. The special "native" asset represents Lumens.
          asset: StellarSdk.Asset.native(),
          amount: body.amount,
        })
      )
      // A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text(body.memo))
      // Wait a maximum of three minutes for the transaction
      .setTimeout(180)
      .build();

    transaction.sign(depSourceKeys);
    const transactionResult =
      await this.testnetServer.submitTransaction(transaction);

    return transactionResult;
  }
}
