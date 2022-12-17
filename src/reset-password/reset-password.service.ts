import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reset } from "./entities/reset.entity";
import { Repository } from "typeorm";

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Reset) private resetRepository: Repository<Reset>,
  ) {}

  async createResetToken(email: string) {
    const token = Math.random().toString(36).substring(2, 15);
    const reset = this.resetRepository.create({ email, token });
    await this.resetRepository.save(reset);
    return {
      message: "reset_token_created",
    };
  }
}
