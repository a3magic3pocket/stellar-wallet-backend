import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StellarServerModule } from "./stellar-server/stellar-server.module";
import { StellarWalletModule } from "./stellar-wallet/stellar-wallet.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역적으로 설정을 사용할 수 있도록 설정
      envFilePath: ".env.development", // 환경 변수 파일 경로 설정
    }),
    StellarServerModule,
    StellarWalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
