import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
  const config = new DocumentBuilder()
    .setTitle("NestJS Template")
    .setDescription("The NestJS Template API documentation")
    .setVersion("1.0")
    .addTag("nestjs-template")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap().then(() => console.log("Server is running on port 3000"));
