import { Module } from "@nestjs/common";
import { StellarServerService } from "./stellar-server.service";

@Module({
  providers: [StellarServerService],
  exports: [StellarServerService],
})
export class StellarServerModule {}
