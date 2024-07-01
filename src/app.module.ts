import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StellarServerModule } from "./stellar-server/stellar-server.module";
import { StellarWalletModule } from "./stellar-wallet/stellar-wallet.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ViewController } from './view/view.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./data/stellar-database.sqlite",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development",
    }),
    StellarServerModule,
    StellarWalletModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, ViewController],
  providers: [AppService],
})
export class AppModule {}
