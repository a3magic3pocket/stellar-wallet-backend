import { Controller, Get, Render } from "@nestjs/common";

@Controller("/view")
export class ViewController {
  commonArgs;
  constructor() {
    this.commonArgs = {
      rootUrl: process.env.VIEW_ROOT_URL,
    };
  }
  @Get("/login")
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
