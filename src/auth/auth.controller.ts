import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "./guards/local-auth.guard";

@ApiTags("Auth")
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

  @UseGuards(LocalGuard)
  @Post("login")
  async login(
    @Body("login") login: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response,
  ) {
    const user = await this.authService.validateUser(login, password);
    return this.authService.getTokens(user, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Req() request: Request, @Res({ passthrough: true }) response) {
    return this.authService.logout(request, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(@Req() request: Request) {
    return this.authService.refreshToken(request);
  }

  @Post("google")
  async googleAuth(
    @Body("token") token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.googleAuth(token, response);
  }
}
