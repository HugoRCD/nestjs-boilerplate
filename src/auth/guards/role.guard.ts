import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, ROLES_KEY } from "../decorators/role.decorator";
import { UserService } from "../../user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  matchRoles(requiredRoles: Role[], userRole: Role): boolean {
    return requiredRoles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException("unauthorized_access_no_user");
    }
    const user = await this.userService.getUserById(request.user.id);
    if (!this.matchRoles(roles, user.role)) {
      throw new UnauthorizedException("insufficient_permissions");
    } else {
      return true;
    }
  }
}
