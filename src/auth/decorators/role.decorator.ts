import { SetMetadata } from "@nestjs/common";
export enum Role {
  USER = 0,
  ADMIN = 1,
}

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
