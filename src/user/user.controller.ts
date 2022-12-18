import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser, JwtAuthGuard } from "../auth/guards/jwt.guard";
import { User } from "./entities/user.entity";
import { RoleGuard } from "../auth/guards/role.guard";
import { Role, Roles } from "../auth/decorators/role.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("User")
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getUserById(user.id);
  }

  @Roles(Role.ADMIN)
  @Get("/all")
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(":id")
  async getUserById(@Param("id") id: number) {
    return this.userService.getUserById(id);
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    return this.userService.deleteUser(id);
  }
}
