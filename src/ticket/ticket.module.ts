import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { MailingModule } from "../mailing/mailing.module";
import { Ticket } from "./entities/ticket.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { TicketController } from "./ticket.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), MailingModule, UserModule],
  providers: [TicketService],
  exports: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
