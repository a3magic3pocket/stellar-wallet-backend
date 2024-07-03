import {
  Controller,
  Post,
  UseGuards,
  Req,
  Session,
  Query,
  Res,
  Get,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { IAuthSession } from "./interface/auth-session.interface";
import { User } from "src/user/user.entity";
import { ISimpleSuccessRespDto } from "../global/dto/interface/simple-success-resp-dto.interface";
import { LoginGaurd } from "./login.guard";
import { LogoutQueryDto } from "./dto/logout-query.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LoginBodyDto } from "./dto/login-body.dto";

@ApiTags("auth")
@Controller("/auth")
export class AuthController {
  @Post("/login")
  @UseGuards(AuthGuard("local"))
  @ApiOperation({ summary: "로그인" })
  @ApiBody({ description: "body", type: LoginBodyDto })
  async login(@Req() req: Request, @Session() session: IAuthSession) {
    session.user = req.user as User;

    const resp: ISimpleSuccessRespDto = {
      message: "success",
    };

    return resp;
  }

  @Get("/logout")
  @ApiOperation({ summary: "로그아웃" })
  @ApiQuery({
    name: "callback",
    type: "string",
    description: "로그아웃 후 리디렉션 할 url",
    required: false,
  })
  @UseGuards(LoginGaurd)
  async logout(
    @Query() query: LogoutQueryDto,
    @Session() session: IAuthSession,
    @Req() req: Request,
    @Res() res: Response
  ) {
    session.destroy(() => {});

    let callbackUrl = query.callback ? query.callback : req.headers.referer;

    return res.redirect(callbackUrl);
  }
}
