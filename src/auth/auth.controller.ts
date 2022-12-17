import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  async login(
    @Body("login") login: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response,
  ) {
    const user = await this.authService.validateUser(login, password);
    return this.authService.getTokens(user, response);
  }
}
