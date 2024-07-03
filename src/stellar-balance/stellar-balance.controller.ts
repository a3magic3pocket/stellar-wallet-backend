import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { PublicKeyQueryDto } from "src/global/dto/public-key-query.dto";
import { LoginGaurd } from "src/auth/login.guard";
import { StellarBalanceService } from "./stellar-balance.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("balance")
@Controller("/stellar")
@UseGuards(LoginGaurd)
export class StellarBalanceController {
  constructor(private readonly stellarBalanceService: StellarBalanceService) {}

  @Get("/testnet/balances")
  @UseGuards(LoginGaurd)
  @ApiOperation({ summary: "testnet 잔액 조회" })
  @ApiQuery({
    name: "public-key",
    type: "string",
    description: "대상 지갑 publicKey",
  })
  async listTestnetBalances(@Query() query: PublicKeyQueryDto) {
    return await this.stellarBalanceService.listTestnetBalances(
      query.publicKey
    );
  }
}
