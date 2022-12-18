import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { RoleGuard } from "../auth/guards/role.guard";
import { CurrentUser, JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Role, Roles } from "../auth/decorators/role.decorator";
import { TicketUpdateInput } from "./dto/ticket-update.input";
import { JwtPayload } from "../auth/auth.service";
import { TicketCreateInput } from "./dto/ticket-create.input";

@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  getTickets() {
    return this.ticketService.getTickets();
  }

  @Get(":id")
  getTicket(@Param("id") id: number) {
    return this.ticketService.getTicket(id);
  }

  @Post()
  createTicket(
    @Body() ticket: TicketCreateInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketService.createTicket(ticket, user);
  }

  @Delete(":id")
  deleteTicket(@Param("id") id: number) {
    return this.ticketService.deleteTicket(id);
  }

  @Patch(":id")
  updateTicket(@Param("id") id: number, @Body() ticket: TicketUpdateInput) {
    return this.ticketService.updateTicket(id, ticket);
  }
}
