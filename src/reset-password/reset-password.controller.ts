import { Body, Controller, Post } from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";

@Controller("reset-password")
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  async forgotPassword(@Body("email") email: string) {
    return await this.resetPasswordService.createResetToken(email);
  }
}
