import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MailingModule } from "../mailing/mailing.module";
import { VerifCode } from "./entities/verif-code.entity";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User, VerifCode]), MailingModule],
  controllers: [UserController],
  providers: [UserService, User, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
