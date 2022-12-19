import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../user/entities/user.entity";
@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}
  async sendNewVerification(user: User, url: string): Promise<void> {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Please confirm your email",
        template: "verif-code",
        context: {
          username: user.username,
          verifyUrl: url,
        },
        attachments: [
          {
            filename: "logo.png",
            path: __dirname + "/templates/assets/logo.png",
            cid: "logo",
          },
          {
            filename: "facebook.png",
            path: __dirname + "/templates/assets/facebook.png",
            cid: "facebook",
          },
          {
            filename: "twitter.png",
            path: __dirname + "/templates/assets/twitter.png",
            cid: "twitter",
          },
          {
            filename: "instagram.png",
            path: __dirname + "/templates/assets/instagram.png",
            cid: "instagram",
          },
          {
            filename: "linkedin.png",
            path: __dirname + "/templates/assets/linkedin.png",
            cid: "linkedin",
          },
        ],
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendNewUser(user: User, url: string): Promise<void> {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Welcome to NestJS",
        template: "new-user",
        context: {
          username: user.username,
          verifyUrl: url,
        },
        attachments: [
          {
            filename: "logo.png",
            path: __dirname + "/templates/assets/logo.png",
            cid: "logo",
          },
          {
            filename: "facebook.png",
            path: __dirname + "/templates/assets/facebook.png",
            cid: "facebook",
          },
          {
            filename: "twitter.png",
            path: __dirname + "/templates/assets/twitter.png",
            cid: "twitter",
          },
          {
            filename: "instagram.png",
            path: __dirname + "/templates/assets/instagram.png",
            cid: "instagram",
          },
          {
            filename: "linkedin.png",
            path: __dirname + "/templates/assets/linkedin.png",
            cid: "linkedin",
          },
        ],
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendResetPassword(user: User, resetUrl: string): Promise<void> {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Reset your password",
        template: "reset-password",
        context: {
          username: user.username,
          resetUrl: resetUrl,
        },
        attachments: [
          {
            filename: "logo.png",
            path: __dirname + "/templates/assets/logo.png",
            cid: "logo",
          },
          {
            filename: "facebook.png",
            path: __dirname + "/templates/assets/facebook.png",
            cid: "facebook",
          },
          {
            filename: "twitter.png",
            path: __dirname + "/templates/assets/twitter.png",
            cid: "twitter",
          },
          {
            filename: "instagram.png",
            path: __dirname + "/templates/assets/instagram.png",
            cid: "instagram",
          },
          {
            filename: "linkedin.png",
            path: __dirname + "/templates/assets/linkedin.png",
            cid: "linkedin",
          },
        ],
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
