import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../user/entities/user.entity";

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  infos = {
    company: "Vue Template",
    address: "1 rue de la paix",
    city: "Paris",
    zip: "75000",
    country: "France",
    phone: "+33 1 23 45 67 89",
    email: "demo@vuetemplate.com",
    website: "https://vuetemplate.com",
    social: {
      facebook: "https://www.facebook.com/vuetemplate",
      twitter: "https://twitter.com/vuetemplate",
      instagram: "https://www.instagram.com/vuetemplate",
      linkedin: "https://www.linkedin.com/company/vuetemplate",
    },
  };

  public sendMail(
    user: User,
    template: string,
    subject: string,
    variables: any,
  ): void {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: subject,
        template: template,
        context: {
          ...this.infos,
          ...variables,
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
        console.log("Mail sent to " + user.email);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }
}
