import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reset } from "./entities/reset.entity";
import { Repository } from "typeorm";
import { MailingService } from "../mailing/mailing.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { utils } from "../utils/bcrypt";

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Reset) private resetRepository: Repository<Reset>,
    private readonly mailingService: MailingService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async createResetToken(email: string) {
    const user = await this.userService.getUserByLogin(email);
    if (!user) {
      throw new BadRequestException("user_not_found");
    }
    const token = Math.random().toString(36).substring(2, 15);
    const reset = this.resetRepository.create({ email, token });
    await this.resetRepository.save(reset);
    const resetUrl = `${this.configService.get(
      "frontend_url",
    )}/app/reset-password-${token}`;
    await this.mailingService.sendResetPassword(user, resetUrl);
    return {
      message: "reset_token_created",
    };
  }

  async resetPassword(token: string, password: string) {
    const reset = await this.resetRepository.findOne({ where: { token } });
    if (!reset) {
      throw new BadRequestException("invalid_token");
    }
    const user = await this.userService.getUserByLogin(reset.email);
    if (!user) {
      throw new BadRequestException("user_not_found");
    }
    user.password = await utils.encrypt(password);
    await this.userService.updatePassword(user.id, user.password);
    await this.resetRepository.delete(reset.id);
    await this.mailingService.sendResetPasswordSuccess(user);
    return {
      message: "password_reset",
    };
  }
}
