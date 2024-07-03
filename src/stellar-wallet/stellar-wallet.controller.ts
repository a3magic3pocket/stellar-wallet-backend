import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { StellarWalletService } from "./stellar-wallet.service";
import { LoginGaurd } from "src/auth/login.guard";
import { ISimpleSuccessRespDto } from "src/global/dto/interface/simple-success-resp-dto.interface";
import { Session } from "@nestjs/common";
import { IAuthSession } from "src/auth/interface/auth-session.interface";
import { PublicKeyQueryDto } from "src/global/dto/public-key-query.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("wallet")
@Controller("/stellar")
export class StellarWalletController {
  constructor(private readonly stellarWalletService: StellarWalletService) {}

  @Post("/testnet/wallet")
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "지갑 생성" })
  async createTestnetWallet(@Session() session: IAuthSession) {
    await this.stellarWalletService.createTestnetWallet(session.user.id);

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }

  @Get("/testnet/wallets")
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "지갑 목록 조회" })
  async listTestnetWallets(@Session() session: IAuthSession) {
    return await this.stellarWalletService.listMyWallets(
      session.user.id,
      "testnet"
    );
  }

  @Get("/testnet/secret")
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "지갑 시크릿 키 조회" })
  @ApiQuery({
    name: "public-key",
    type: "string",
    description: "대상 지갑 publicKey",
  })
  async retrieveTestnetSecret(
    @Query() query: PublicKeyQueryDto,
    @Session() session: IAuthSession
  ) {
    let result = await this.stellarWalletService.retrieveSecret(
      session.user.id,
      query.publicKey,
      "testnet"
    );

    if (result === null) {
      result = {
        secret: null,
      };
    }

    return result;
  }
}
