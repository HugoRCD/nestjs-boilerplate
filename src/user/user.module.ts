import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MailingModule } from "../mailing/mailing.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => MailingModule)],
  controllers: [UserController],
  providers: [UserService, User],
  exports: [UserService],
})
export class UserModule {}
