import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

const domains = [
  "http://localhost:8080",
  "http://localhost:3000",
  "https://vuejs-frontend-template.herokuapp.com",
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: domains,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap().then(() => console.log("Server is running on port 3000"));
