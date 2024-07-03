import { Module } from "@nestjs/common";
import { StellarBalanceController } from "./stellar-balance.controller";
import { StellarBalanceService } from "./stellar-balance.service";
import { StellarServerModule } from "@src/stellar-server/stellar-server.module";

@Module({
  imports: [StellarServerModule],
  controllers: [StellarBalanceController],
  providers: [StellarBalanceService],
})
export class StellarBalanceModule {}
