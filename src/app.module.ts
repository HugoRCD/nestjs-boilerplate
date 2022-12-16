import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { join } from "path";
import { UserModule } from "./user/user.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailingModule } from "./mailing/mailing.module";
import { CronModule } from "./cron/cron.module";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

/*const domains = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:3000",
  "https://vuejs-frontend-template.herokuapp.com",
];*/

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: configService.get("MAIL_PORT"),
          auth: {
            user: configService.get("MAIL_USER"),
            pass: configService.get("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: "No Reply < demo@vuetemplate.com >",
        },
        preview: false,
        template: {
          dir: join(__dirname, "mailing/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: parseInt(configService.get("DB_PORT")),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [join(__dirname, "**", "*.entity.{ts,js}")],
        synchronize: true,
      }),
    }),
    UserModule,
    MailingModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
