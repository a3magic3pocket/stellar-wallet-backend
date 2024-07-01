import { Controller, Get, Render } from "@nestjs/common";

@Controller("/view")
export class ViewController {
  @Get("/login")
  @Render("login")
  hello() {
    return { message: "hello message" };
  }
}
