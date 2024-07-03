import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { StellarTransactionSendBodyDto } from "./dto/stellar-transaction-send-body.dto";
import { StellarTransactionService } from "./stellar-transaction.service";
import { StellarWalletRepository } from "src/stellar-wallet/stellar-wallet.repository";
import { IAuthSession } from "src/auth/interface/auth-session.interface";
import { decryptAES } from "src/global/crypto/aes";
import { ISimpleSuccessRespDto } from "src/global/dto/interface/simple-success-resp-dto.interface";
import { StellarTransactionsListQueryDto } from "./dto/stellar-transaction-list-query.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LoginGaurd } from "src/auth/login.guard";

@ApiTags("transaction")
@Controller("/stellar")
export class StellarTransactionController {
  constructor(
    private readonly stellarTransactionService: StellarTransactionService,
    private readonly stellarWalletRepository: StellarWalletRepository
  ) {}

  @Post("/testnet/send")
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "testnet 전송" })
  @ApiBody({ description: "body", type: StellarTransactionSendBodyDto })
  async sendTestnet(
    @Body() body: StellarTransactionSendBodyDto,
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
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "testnet transaction 목록 조회" })
  @ApiQuery({
    name: "limit",
    type: "number",
    description: "조회할 행 수",
    required: false,
  })
  @ApiQuery({
    name: "cursor",
    type: "string",
    description: "조회 시작 transaction pagingToken",
    required: false,
  })
  @ApiQuery({
    name: "public-key",
    type: "string",
    description: "대상 지갑 publicKey",
    required: true,
  })
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
