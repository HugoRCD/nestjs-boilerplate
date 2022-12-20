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
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Role, Roles } from "../auth/decorators/role.decorator";
import { TicketUpdateInput } from "./dto/ticket-update.input";
import { JwtPayload } from "../auth/auth.service";
import { TicketCreateInput } from "./dto/ticket-create.input";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("Ticket")
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getTickets() {
    return this.ticketService.getTickets();
  }

  @Get(":id")
  async getTicket(@Param("id") id: number) {
    return this.ticketService.getTicket(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async createTicket(
    @Body() ticket: TicketCreateInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketService.createTicket(ticket, user);
  }

  @Patch(":id")
  async updateTicket(
    @Param("id") id: number,
    @Body() ticket: TicketUpdateInput,
  ) {
    return this.ticketService.updateTicket(id, ticket);
  }

  @Delete(":id")
  async deleteTicket(@Param("id") id: number) {
    return this.ticketService.deleteTicket(id);
  }
}
