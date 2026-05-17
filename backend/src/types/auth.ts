import { Request } from "express";

export type UserRole = "admin" | "sales";

export interface JwtUser {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}
