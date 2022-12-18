import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { MailingModule } from "./mailing/mailing.module";
import { CronModule } from "./cron/cron.module";
import { AuthModule } from "./auth/auth.module";
import { ResetPasswordModule } from "./reset-password/reset-password.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    MailingModule,
    CronModule,
    AuthModule,
    ResetPasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
