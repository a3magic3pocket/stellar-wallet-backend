import { Controller, Get, Render } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("view")
@Controller("/view")
export class ViewController {
  commonArgs;
  constructor() {
    this.commonArgs = {
      rootUrl: process.env.VIEW_ROOT_URL,
    };
  }
  @Get("/login")
  @ApiOperation({
    summary: "이 경로로 브라우저에서 접속하여 로그인 후 session을 획득 ",
  })
  @Render("login")
  login() {
    return { ...this.commonArgs };
  }

  @Get("/main")
  @Render("main")
  async main() {
    return { ...this.commonArgs };
  }
}
