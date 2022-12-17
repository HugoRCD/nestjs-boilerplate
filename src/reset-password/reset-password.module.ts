import { Module } from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordController } from "./reset-password.controller";
import { Reset } from "./entities/reset.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";
import { MailingModule } from "../mailing/mailing.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    UserModule,
    ConfigModule,
    MailingModule,
  ],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
