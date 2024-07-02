import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UnprocessableEntityException,
} from "@nestjs/common";
import { StellarTransactionSendBody } from "./dto/stellar-transaction-send-body.dto";
import { StellarTransactionService } from "./stellar-transaction.service";
import { StellarWalletRepository } from "src/stellar-wallet/stellar-wallet.repository";
import { IAuthSession } from "src/auth/interface/auth-session.interface";
import { decryptAES } from "src/global/crypto/aes";
import { ISimpleSuccessRespDto } from "src/global/dto/interface/simple-success-resp-dto.interface";
import { StellarTransactionsListQueryDto } from "./dto/stellar-transaction-list-query.dto";

@Controller("/stellar")
export class StellarTransactionController {
  constructor(
    private readonly stellarTransactionService: StellarTransactionService,
    private readonly stellarWalletRepository: StellarWalletRepository
  ) {}

  @Post("/testnet/send")
  async sendTestnet(
    @Body() body: StellarTransactionSendBody,
    @Session() session: IAuthSession
  ) {
    const wallet = await this.stellarWalletRepository.findOneSecret(
      session.user.id,
      body.departurePublicKey,
      "testnet"
    );
    if (wallet === null) {
      throw new UnprocessableEntityException("invalid departure-public-key");
    }

    const depSecret = decryptAES(wallet.secret);

    await this.stellarTransactionService.sendTestnet(body, depSecret);

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }

  @Get("/testnet/transactions")
  async listTransactions(@Query() query: StellarTransactionsListQueryDto) {
    let limit = query.limit;
    const maxLimit = 10;
    if (!limit) {
      limit = maxLimit;
    } else if (limit > maxLimit) {
      limit = maxLimit;
    }

    const refinedQuery: StellarTransactionsListQueryDto = {
      walletPublicKey: query.walletPublicKey,
      limit,
      cursor: query.cursor,
    };

    return await this.stellarTransactionService.listTestnetTransactions(
      refinedQuery
    );
  }
}
