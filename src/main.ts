import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import * as session from "express-session";
import * as SQLite3 from "connect-sqlite3";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 템플릿 엔진 설정
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "view"));
  app.setViewEngine("ejs");

  // 전역 유효성 검사 설정
  app.useGlobalPipes(new ValidationPipe());

  // SQLiteStore 설정
  const SQLite3Store = SQLite3(session);

  // 세션 설정
  app.use(
    session({
      secret: process.env.AUTH_COOKIE_SECRET,
      store: new SQLite3Store({ dir: "./data", db: "session.sqlite" }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 36000000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(8080);
}
bootstrap();
