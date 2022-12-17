import { Test, TestingModule } from "@nestjs/testing";
import { MailingService } from "./mailing.service";

describe("MailingService", () => {
  let service: MailingService;
  const testUser = {
    id: 1,
    username: "Test",
    password: "test123",
    email: "hrichard206@gmail.com",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingService],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  describe("send email new verif code", () => {
    it("should send email new verif code", () => {
      expect(service.sendNewVerifCode(testUser)).toBe("Mail sent");
    });
  });

  describe("send email new user", () => {
    it("should send email new user", () => {
      expect(service.sendNewUser(testUser)).toBe("Mail sent");
    });
  });
});
