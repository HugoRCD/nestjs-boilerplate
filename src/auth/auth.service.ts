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

interface GooglePayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
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
      secret: this.configService.get("jwt.access_token_secret"),
      expiresIn: this.configService.get("jwt.access_token_expiration"),
    });
  }

  async createRefreshToken(user) {
    const payload: JwtPayload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwt.refresh_token_secret"),
      expiresIn: this.configService.get("jwt.refresh_token_expiration"),
    });
  }

  async getTokens(user, response) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.userService.insertRefreshToken(user.id, refreshToken);
    response
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200);
    return { accessToken };
  }

  async refreshToken(request) {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("refresh_token_not_provided");
    }
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get("jwt.refresh_token_secret"),
    });
    const user = await this.userService.getUserById(payload.id);
    const decryptedRefreshToken = await utils.decrypt(
      refreshToken,
      user.refreshToken,
    );
    if (decryptedRefreshToken) {
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
      secret: this.configService.get("jwt.refresh_token_secret"),
    });
    await this.userService.removeRefreshToken(payload.id);
    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return { message: "success" };
  }

  async googleAuth(token, response) {
    const client = new OAuth2Client(this.configService.get("google.client_id"));
    client.setCredentials({ access_token: token });
    const googleUser = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    const userInfo = googleUser.data as GooglePayload;
    const user = await this.userService.getUserByLogin(userInfo.email);
    if (user) {
      return this.getTokens(user, response);
    } else {
      const newUser = new User();
      newUser.username =
        userInfo.given_name +
        userInfo.family_name +
        Math.floor(Math.random() * 1000);
      newUser.email = userInfo.email;
      newUser.firstname = userInfo.given_name;
      newUser.lastname = userInfo.family_name;
      newUser.password = await utils.encrypt(token);
      newUser.avatar = userInfo.picture;
      const createdUser = await this.userService.create(newUser);
      return this.getTokens(createdUser, response);
    }
  }
}
