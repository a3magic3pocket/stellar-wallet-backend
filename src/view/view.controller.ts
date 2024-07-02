import { Controller, Get, Render } from "@nestjs/common";

@Controller("/view")
export class ViewController {
  constructor() {}
  @Get("/login")
  @Render("login")
  login() {
    return {};
  }

  @Get("/main")
  @Render("main")
  async main() {
    return {};
  }
}
