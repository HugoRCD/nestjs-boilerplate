import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MailingService } from "../mailing/mailing.service";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { utils } from "../utils/bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailingService: MailingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (findUser) {
      throw new BadRequestException("user_already_exists");
    }
    const hashedPassword = await utils.encrypt(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    await this.mailingService.sendNewUser(user);
    return user;
  }

  async insertRefreshToken(id: number, refreshToken: string) {
    const userToInsert = await this.userRepository.findOne({ where: { id } });
    userToInsert.refreshToken = await utils.encrypt(refreshToken);
    await this.userRepository.save(userToInsert);
  }

  async removeRefreshToken(id: number) {
    return await this.userRepository.update(id, { refreshToken: null });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    return user;
  }

  async getUserByLogin(login: string) {
    return this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
    });
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    await this.userRepository.update(id, updateUserDto);
    return { message: "user_updated" };
  }

  async updatePassword(id: number, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.password = password;
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    await this.userRepository.delete(id);
    return { message: "user_deleted" };
  }
}
