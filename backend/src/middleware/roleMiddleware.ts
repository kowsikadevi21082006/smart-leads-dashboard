import { NextFunction, Response } from "express";
import { AuthenticatedRequest, UserRole } from "../types/auth";

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    next();
  };
