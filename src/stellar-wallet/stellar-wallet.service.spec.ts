// src/stellar-wallet.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { StellarWalletService } from "./stellar-wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StellarWallet } from "./stellar-wallet.entity";
import { StellarWalletRepository } from "./stellar-wallet.repository";
import { UserService } from "@src/user/user.service";
import { IUserCreateArgs } from "@src/user/interface/user-create-args.interface";
import { User } from "@src/user/user.entity";
import { StellarServerModule } from "@src/stellar-server/stellar-server.module";
import { UserModule } from "@src/user/user.module";
import { ConfigModule } from "@nestjs/config";

describe("StellarWalletService", () => {
  let userService: UserService;
  let stellarWalletService: StellarWalletService;
  let module: TestingModule;
  let user: User;
  let wallet: StellarWallet;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.development",
        }),
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:", // 메모리 기반 DB
          entities: [StellarWallet, User],
          synchronize: true,
          dropSchema: true, // 테스트 시작 전 스키마 삭제
        }),
        TypeOrmModule.forFeature([StellarWallet]),
        StellarServerModule,
        UserModule,
      ],
      providers: [StellarWalletService, StellarWalletRepository],
    }).compile();

    stellarWalletService =
      module.get<StellarWalletService>(StellarWalletService);
    userService = module.get<UserService>(UserService);

    const userCreateArgs: IUserCreateArgs = {
      email: "dfasdfas@kim.com",
      password: "kim-sumi",
      isActive: 1,
      createdAt: new Date(),
    };
    user = await userService.createUser(userCreateArgs);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
    expect(stellarWalletService).toBeDefined();
  });

  it("createTestnetWallet", async () => {
    await stellarWalletService.createTestnetWallet(user.id);
  }, 50000);

  it("listMyWallets, retrieveSecret", async () => {
    const wallets = await stellarWalletService.listMyWallets(
      user.id,
      "testnet"
    );
    expect(wallets.length).toBe(1);

    const publicKey = wallets[0].publicKey;
    const secretResult = await stellarWalletService.retrieveSecret(
      user.id,
      publicKey,
      "testnet"
    );

    expect(secretResult.secret).not.toEqual(undefined)
    expect(typeof secretResult.secret).toEqual('string')
  });
});
