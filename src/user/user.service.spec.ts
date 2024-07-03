// src/user.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { IUserCreateArgs } from "./interface/user-create-args.interface";

describe("UserService", () => {
  let userService: UserService;
  let module: TestingModule;
  let user: User;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:", // 메모리 기반 DB
          entities: [User],
          synchronize: true,
          dropSchema: true, // 테스트 시작 전 스키마 삭제
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService, UserRepository],
    }).compile();

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
  });

  it("findOneByEmail", async () => {
    const foundUser = await userService.findOneByEmail(user.email);
    expect(foundUser.email).toBe(user.email);
  });

  it("hashPassword, comparePasswords", async () => {
    const foundUser = await userService.findOneByEmail(user.email);
    const isSame = userService.comparePasswords(
      user.password,
      foundUser.password
    );
    expect(isSame).toBeTruthy();
  });
});
