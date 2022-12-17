import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { utils } from "../utils/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

interface JwtPayload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.userService.getUserByLogin(login);
    if (!user || !(await utils.decrypt(password, user.password))) {
      throw new BadRequestException("invalid_credentials");
    }
    return user;
  }

  async createAccessToken(user) {
    const payload: JwtPayload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRATION"),
    });
  }

  async createRefreshToken(user) {
    const payload: JwtPayload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRATION"),
    });
  }

  async getTokens(user, response) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.userService.insertRefreshToken(user.id, refreshToken);
    response
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200);
    return { accessToken };
  }

  async refreshToken(request, response) {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("refresh_token_not_provided");
    }
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
    });
    const user = await this.userService.getUserById(payload.id);
    const decryptedRefreshToken = utils.decrypt(
      refreshToken,
      user.refreshToken,
    );
    if (decryptedRefreshToken) {
      response.status(200);
      return {
        accessToken: await this.createAccessToken(user),
      };
    }
    throw new UnauthorizedException("invalid_refresh_token");
  }

  async logout(request, response) {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("refresh_token_not_provided");
    }
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
    });
    await this.userService.removeRefreshToken(payload.id);
    response.clearCookie("refreshToken");
    response.status(200);
    return { message: "success" };
  }
}
