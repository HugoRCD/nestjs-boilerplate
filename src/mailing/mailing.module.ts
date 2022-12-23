import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailingService } from "./mailing.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("mailer.host"),
          port: configService.get("mailer.port"),
          auth: {
            user: configService.get("mailer.auth.user"),
            pass: configService.get("mailer.auth.password"),
          },
        },
        defaults: {
          from: "No Reply - demo@vuetemplate.com",
        },
        preview: false,
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
