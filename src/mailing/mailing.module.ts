import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailingService } from "./mailing.service";

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
