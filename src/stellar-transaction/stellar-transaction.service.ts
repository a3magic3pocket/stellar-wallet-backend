import { Injectable } from "@nestjs/common";
import { StellarTransactionSendBody } from "./dto/stellar-transaction-send-body.dto";
import * as StellarSdk from "@stellar/stellar-sdk";
import { StellarServerService } from "src/stellar-server/stellar-server.service";
import { StellarTransactionsListQueryDto } from "./dto/stellar-transaction-list-query.dto";
import { IStellarTransactionRecordDto } from "./interface/stellar-transaction-record-dto.interface";
import { IStellarTransactionOperationDto } from "./interface/stellar-transaction-operation-dto.interface";

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

  async listTestnetTransactions(query: StellarTransactionsListQueryDto) {
    const result: IStellarTransactionRecordDto[] = [];
    let transResult = {
      records: [],
    };
    let cursor = query.cursor;

    const builder = this.testnetServer
      .transactions()
      .forAccount(query.walletPublicKey)
      .limit(query.limit)
      .order("desc");

    if (cursor !== null) {
      builder.cursor(cursor);
    }

    transResult = await builder.call();

    for (const record of transResult.records) {
      const operations = await record.operations();
      const newOpers: IStellarTransactionOperationDto[] = [];
      let amount = 0;

      for (const oper of operations.records) {
        const newOper: IStellarTransactionOperationDto = {
          transactionSuccessful: oper.transaction_successful,
          sourceAccount: oper.source_account,
          type: oper.type,
          typeI: oper.type_i,
          createdAt: oper.created_at,
          transactionHash: oper.transaction_hash,
          assetType: oper.asset_type || null,
          from: oper.from || null,
          to: oper.to || null,
          amount: oper.amount || null,
        };

        if (oper.asset_type === "native") {
          const floatAmount = parseFloat(oper.amount);
          if (!isNaN(floatAmount)) {
            amount += floatAmount;
          }
        }
        newOpers.push(newOper);
      }

      const newRecord: IStellarTransactionRecordDto = {
        id: record.id,
        successful: record.successful,
        sourceAccount: record.source_account,
        pagingToken: record.paging_token,
        memo: record.memo || null,
        feeCharged: record.fee_charged,
        operation_count: record.operation_count,
        amount,
        operations: newOpers,
      };
      result.push(newRecord);
    }

    if (transResult.records.length > 0) {
      cursor = transResult.records[transResult.records.length - 1].paging_token;
    }

    return result;
  }
}
