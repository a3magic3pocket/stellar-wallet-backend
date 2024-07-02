import { Controller, Post, UseGuards, Req, Session } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { IAuthSession } from "./interface/auth-session.interface";
import { User } from "src/user/user.entity";
import { ISimpleSuccessRespDto } from "./global/dto/interface/simple-success-resp-dto.interface";
import { LoginGaurd } from "./login.guard";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  @UseGuards(AuthGuard("local"))
  async login(@Req() req: Request, @Session() session: IAuthSession) {
    session.user = req.user as User;

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }

  @Post("/logout")
  @UseGuards(LoginGaurd)
  async logout(@Session() session: IAuthSession) {
    session.destroy(() => {});

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }
}
