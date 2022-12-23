import { BadRequestException, Injectable } from "@nestjs/common";
import { Ticket } from "./entities/ticket.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MailingService } from "../mailing/mailing.service";
import { TicketCreateInput } from "./dto/ticket-create.input";
import { JwtPayload } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { TicketUpdateInput } from "./dto/ticket-update.input";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private mailingService: MailingService,
    private userService: UserService,
  ) {}

  async createTicket(ticket: TicketCreateInput, user: JwtPayload) {
    const name = "#" + Math.floor(Math.random() * 10000) + " - " + ticket.type;
    const findUser = await this.userService.getUserById(user.id);
    const newTicket = this.ticketRepository.create({
      name,
      type: ticket.type,
      description: ticket.description,
      email: findUser.email,
    });
    await this.ticketRepository.save(newTicket);
    await this.mailingService.sendTicketReceived(findUser, name);
    return { message: "ticket_created" };
  }

  async getTickets() {
    const tickets = await this.ticketRepository.find();
    if (!tickets) {
      throw new BadRequestException("tickets_not_found");
    }
    return tickets;
  }

  async getTicket(id: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new BadRequestException("ticket_not_found");
    }
    return ticket;
  }

  async updateTicket(id: number, ticket: TicketUpdateInput) {
    const findTicket = await this.ticketRepository.findOne({ where: { id } });
    if (!findTicket) {
      throw new BadRequestException("ticket_not_found");
    }
    const updatedTicket = Object.assign(findTicket, ticket);
    return await this.ticketRepository.save(updatedTicket);
  }

  async deleteTicket(id: number) {
    const findTicket = await this.ticketRepository.findOne({ where: { id } });
    if (!findTicket) {
      throw new BadRequestException("ticket_not_found");
    }
    await this.ticketRepository.delete(id);
    return { message: "ticket_deleted" };
  }
}
