import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import * as session from "express-session";
import * as SQLite3 from "connect-sqlite3";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as express from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";  

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 템플릿 엔진 설정
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "view"));
  app.setViewEngine("ejs");

  // 정적 파일 경로 설정
  app.use("/public", express.static(process.env.STATIC_DIR_PATH));

  // 전역 유효성 검사 설정
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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

  // swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle("stellar-wallet API 문서")
    .setDescription("스텔라루멘의 testnet 지갑 프로토타입<br> - /view/login으로 브라우저에서 접속하여 로그인 후 session을 획득")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);  
  const swaggerEndpoint = "api";  
  SwaggerModule.setup(swaggerEndpoint, app, document);  

  await app.listen(8080);
}
bootstrap();
