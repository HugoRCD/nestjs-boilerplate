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

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getUserById(user.id);
  }

  @Get("/all")
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(":id")
  getUserById(@Param("id") id: number) {
    return this.userService.getUserById(id);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.userService.remove(+id);
  }
}
