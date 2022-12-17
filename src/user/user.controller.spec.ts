import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

describe("UserController", () => {
  let controller: UserController;

  const testUser: User = {
    id: 1,
    username: "test",
    email: "test@gmail.com",
    password: "test123",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe("Create user", () => {
    it("Should return created user)", () => {
      expect(controller.create(testUser)).toBe(User);
    });
  });

  describe("Get user by id", () => {
    it("Should return user by id", () => {
      expect(controller.findOne(1)).toBe(User);
    });
  });

  describe("Get all users", () => {
    it("Should return all users", () => {
      expect(controller.findAll()).toBe(User);
    });
  });
});
