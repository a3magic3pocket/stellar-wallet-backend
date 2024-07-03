import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { IUserCreateArgs } from "./interface/user-create-args.interface";
import { ISimpleSuccessRespDto } from "src/global/dto/interface/simple-success-resp-dto.interface";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "testnet 전송" })
  @ApiBody({ description: "body", type: UserCreateDto })
  async createUser(@Body() body: UserCreateDto) {
    const email = await this.userService.findOneByEmail(body.email);
    if (email !== null) {
      throw new UnprocessableEntityException(
        "the email address is already registered"
      );
    }

    const userCreateArgs: IUserCreateArgs = {
      email: body.email,
      password: body.password,
      isActive: 1,
      createdAt: new Date(),
    };

    await this.userService.createUser(userCreateArgs);

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }
}
