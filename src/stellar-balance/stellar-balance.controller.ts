import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { PublicKeyQueryDto } from "src/global/dto/public-key-query.dto";
import { LoginGaurd } from "src/auth/login.guard";
import { StellarBalanceService } from "./stellar-balance.service";

@Controller("/stellar")
@UseGuards(LoginGaurd)
export class StellarBalanceController {
  constructor(private readonly stellarBalanceService: StellarBalanceService) {}

  @Get("/testnet/balances")
  async listTestnetBalances(@Query() query: PublicKeyQueryDto) {
    return await this.stellarBalanceService.listTestnetBalances(
      query.publicKey
    );
  }
}
