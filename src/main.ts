import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ["http://localhost:8080", process.env.FRONTEND_URL],
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap().then(() => console.log("Server is running on port 3000"));
