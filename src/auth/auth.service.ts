import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { utils } from "../utils/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { User } from "../user/entities/user.entity";

export interface JwtPayload {
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
    const decryptedRefreshToken = await utils.decrypt(
      refreshToken,
      user.refreshToken,
    );
    if (decryptedRefreshToken) {
      response.status(200);
      return {
        accessToken: await this.createAccessToken(user),
      };
    } else {
      throw new UnauthorizedException("invalid_refresh_token");
    }
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

  async googleAuth(token, response) {
    const client = new OAuth2Client(this.configService.get("GOOGLE_CLIENT_ID"));
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.get("GOOGLE_CLIENT_ID"),
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException("invalid_google_token");
    }
    const user = await this.userService.getUserByLogin(payload.email);
    if (user) {
      return this.getTokens(user, response);
    } else {
      const newUser = new User();
      newUser.username = payload.given_name + " " + payload.family_name;
      newUser.email = payload.email;
      newUser.firstname = payload.given_name;
      newUser.lastname = payload.family_name;
      newUser.password = await utils.encrypt(token);
      const createdUser = await this.userService.create(newUser);
      return this.getTokens(createdUser, response);
    }
  }
}
